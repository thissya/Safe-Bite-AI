from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import transformers
import torch
from transformers import AutoTokenizer, pipeline
from PIL import Image
import io
import uvicorn
import os
from dotenv import load_dotenv
from googletrans import Translator
import ocr_utils  # Assuming you have a utility file named ocr_utils for OCR processing

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific domains in production for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a data model for validation
class ValidateRequest(BaseModel):
    user_id: str
    message: str
    language: str

# Load language model and tokenizer
model_path = "/kaggle/input/llama-3/transformers/8b-chat-hf/1"  # Adjust path as needed
tokenizer = AutoTokenizer.from_pretrained(model_path)
text_pipeline = pipeline(
    "text-generation",
    model=model_path,
    tokenizer=tokenizer,
    torch_dtype=torch.float16,
    device_map="auto",
)

# Initialize Google Translator
translator = Translator()

# Global user histories to maintain chat context
user_histories = {}

# Define system message for context
system_message = """
You are an AI assistant specialized in providing personalized food consumption advice based on ingredient lists from packaged food products. 
Your role is to help users with specific medical conditions such as allergies, diabetes, hypertension, or food intolerances make informed decisions about their diet. 
Your response should include ingredient details, risks, suitability for the user’s conditions, and recommendations within 200 words.
"""

# Helper function to query the language model
def query_model(system_message, user_message, history, temperature=0.7, max_length=1024):
    user_message = "Question: " + user_message + " Answer:"
    messages = history + [{"role": "user", "content": user_message}]
    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    
    response = text_pipeline(
        prompt,
        do_sample=True,
        top_p=0.9,
        temperature=temperature,
        max_new_tokens=max_length,
        return_full_text=False,
        pad_token_id=tokenizer.eos_token_id
    )
    answer = response[0]['generated_text']
    return answer, messages

# Endpoint to handle text-based messages
@app.post("/message")
async def handle_message(request: ValidateRequest):
    try:
        user_id = request.user_id
        user_message = request.message
        language = request.language.lower()
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(system_message, user_message, history)
        user_histories[user_id] = updated_history[-3:]  # Limit history to last 3 exchanges

        # Handle translation
        if language == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
        elif language == "english":
            translated_response = response
        else:
            raise ValueError("Unsupported language")
        
        return JSONResponse(status_code=200, content={"response": translated_response})
    except Exception as e:
        print(f"Error in /message: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to handle image uploads and chat
@app.post("/chat")
async def handle_chat(
    user_id: str = Form(...),
    image: UploadFile = File(...),
    message: str = Form(...),
    language: str = Form(...)
):
    try:
        # Process uploaded image
        image_content = await image.read()
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")

        # Extract text from image
        extracted_text = ocr_utils.extract_text_from_image("image.jpg")

        # Prepare query with extracted text
        query = f"""
        Extracted ingredients: {extracted_text}.
        Provide detailed information about these ingredients and determine if a user with the condition '{message}' can consume them. 
        Include potential short-term and long-term side effects, within 200 words.
        """
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(system_message, query, history)
        user_histories[user_id] = updated_history[-3:]  # Limit history to last 3 exchanges

        # Handle translation
        language = language.lower()
        if language == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
        elif language == "english":
            translated_response = response
        else:
            raise ValueError("Unsupported language")
        
        return JSONResponse(status_code=200, content={"response": translated_response})
    except Exception as e:
        print(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Main entry point to run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
