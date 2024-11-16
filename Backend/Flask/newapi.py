import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from PIL import Image
import io
import os
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import ngrok
from googletrans import Translator
import ocr_utils

app = FastAPI()

# Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidateRequest(BaseModel):
    user_id: str
    message: str
    language: str

# Load the model
model_path = "/kaggle/input/llama-3/transformers/8b-chat-hf/1"
tokenizer = AutoTokenizer.from_pretrained(model_path)
generation_pipeline = pipeline(
    "text-generation",
    model=AutoModelForCausalLM.from_pretrained(model_path),
    tokenizer=tokenizer,
    device=0  # Use GPU if available
)

# Set the system message
system_message = """
You are an AI assistant specialized in providing personalized food consumption advice based on ingredient lists from packaged food products.
Your goal is to provide insights tailored to the user's medical conditions.
"""

# Store user conversation histories
user_histories = {}
translator = Translator()

# Use the provided ngrok token
ngrok_auth_token = "2lC10VNMNNHozy9qU2wBzosN3at_3QYjZW2FJ2sr1po7qXqqs"
ngrok.set_auth_token(ngrok_auth_token)

# Open a tunnel
public_url = ngrok.connect(8000).public_url
print(f"Public URL: {public_url}")

def query_model(user_message, history, temperature=0.7, max_length=1024):
    prompt = system_message + "\n" + "\n".join([h['content'] for h in history]) + "\n" + f"User: {user_message}\nAI:"
    result = generation_pipeline(prompt, max_length=max_length, do_sample=True, temperature=temperature)
    response = result[0]['generated_text']
    history.append({"role": "assistant", "content": response})
    return response, history

@app.post('/message')
async def message(request: ValidateRequest):
    try:
        user_id = request.user_id
        user_message = request.message
        language = request.language

        # Get or initialize user history
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(user_message, history)
        user_histories[user_id] = updated_history[-3:]  # Limit history to last 3 exchanges

        # Translate response if needed
        if language.lower() == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
            return JSONResponse(status_code=200, content={"response": translated_response})
        elif language.lower() == "english":
            return JSONResponse(status_code=200, content={"response": response})
        else:
            return JSONResponse(status_code=400, content={"response": "Unsupported language selected."})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the message.")

@app.post('/chat')
async def chat(user_id: str = Form(...), image: UploadFile = File(...), message: str = Form(...), language: str = Form(...)):
    try:
        # Read and save image
        image_content = await image.read()
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")

        # Extract text from the image
        extracted_text = ocr_utils.extract_text_from_image("image.jpg")

        # Create query for the model
        query = f"Ingredients: {extracted_text}. User condition: {message}. Analyze ingredients and advise."

        # Get or initialize user history
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(query, history)
        user_histories[user_id] = updated_history[-3:]

        # Translate response if needed
        if language.lower() == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
            return JSONResponse(status_code=200, content={"response": translated_response})
        elif language.lower() == "english":
            return JSONResponse(status_code=200, content={"response": response})
        else:
            return JSONResponse(status_code=400, content={"response": "Unsupported language selected."})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
