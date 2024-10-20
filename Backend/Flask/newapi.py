from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import transformers
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from time import time
import ngrok
import ocr_utils
from PIL import Image
import io
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class ValidateRequest(BaseModel):
    user_id: str
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model setup
model = "/kaggle/input/llama-3/transformers/8b-chat-hf/1"
tokenizer = AutoTokenizer.from_pretrained(model)
pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    torch_dtype=torch.float16,
    device=0
)

# Ngrok configuration
ngrok.set_auth_token(os.getenv("NGROK_AUTH_TOKEN"))
listener = ngrok.forward("127.0.0.1:8000", authtoken_from_env=True, domain=os.getenv("NGROK_DOMAIN"))

user_histories = {}

def query_model(system_message, user_message, history, temperature=0.7, max_length=1024):
    user_message = "Question: " + user_message + " Answer:"
    messages = history + [{"role": "user", "content": user_message}]
    
    # Create prompt from history
    prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
    
    sequences = pipeline(
        prompt,
        do_sample=True,
        top_p=0.9,
        temperature=temperature,
        max_new_tokens=max_length,
        return_full_text=False,
        pad_token_id=pipeline.model.config.eos_token_id
    )
    answer = sequences[0]['generated_text']
    return answer, messages

# System message for the assistant
system_message = (
    "You are an AI assistant specialized in providing personalized food consumption advice based on ingredient lists from packaged food products. "
    "Your role is to help users with specific medical conditions such as allergies, diabetes, hypertension, or food intolerances make informed decisions about their diet. "
    "When given a list of ingredients extracted from a food label, you should provide comprehensive information about each ingredient, including its nutritional value, potential health benefits, and any known risks or side effects. "
    "You should also analyze the ingredients in the context of the user's health profile, which includes details like allergies, medical conditions, and dietary restrictions. "
    "Your response should identify harmful or potentially risky ingredients, provide personalized recommendations on whether the product is suitable for regular consumption, and offer insights on both short-term and long-term health effects. "
    "Additionally, suggest safer alternatives if necessary and track the user's ingredient consumption over time. "
    "Your goal is to enhance the user's ability to make informed decisions about their diet, improving their overall health and well-being through convenience and accuracy."
)

@app.post('/message')
async def message(request: ValidateRequest):
    try:
        user_id = request.user_id
        user_message = request.message
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])
        response, updated_history = query_model(system_message, user_message, history)
        user_histories[user_id] = updated_history[-3:]  # Retain last 3 interactions
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/chat')
async def chat(image: UploadFile = File(...)):
    try:
        image_content = await image.read()
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")
        
        extracted_text = ocr_utils.extract_text_from_image("image.jpg")
        query = f"Extracted ingredients: {extracted_text}. Provide detailed information about these ingredients."
        history = [{"role": "system", "content": system_message}]
        response, _ = query_model(system_message, query, history)
        return {"response": response}
    except Exception as e:
        return {"error": "Error in processing the image or generating response"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
