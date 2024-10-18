import os
import torch
import numpy as np
from transformers import AutoModelForCausalLM, AutoTokenizer
import time
import uvicorn
from fastapi import FastAPI, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import threading
import re
import ngrok
from PIL import Image
from googletrans import Translator
import ocr_utils  # Import the OCR utility

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Initialize models and utilities
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen-VL-Chat", trust_remote_code=True) 
llm_model = AutoModelForCausalLM.from_pretrained("sanjay-29-29/GreenAI", trust_remote_code=True, device_map='auto') 
history = None
ngrok.set_auth_token('2dVBJw5G2bExzQ41keUUDtC0U8K_7zn55apnGM8YJ3RNsfznb')
listener = ngrok.forward("127.0.0.1:8000", authtoken_from_env=True, domain="glowing-polite-porpoise.ngrok-free.app")
translator = Translator()

def extract_text_from_multipart(query: str):
    pattern = r'------WebKitFormBoundary.*\r\nContent-Disposition: form-data; name="query"\r\n\r\n(.*)\r\n------WebKitFormBoundary'
    match = re.search(pattern, query)
    if match:
        return match.group(1).strip()
    else:
        raise ValueError("Could not find query text within multipart data")

def tamil_translate(text):
    global translator
    tamil_text = translator.translate(text, src='en', dest='ta').text
    return tamil_text

@app.post("/english_image_query")
async def process_image(image: UploadFile = File(...)):
    global history, llm_model, tokenizer
    image_content = await image.read()
    try:
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")
    except Exception as e:
        print(e)
        return {"error": "Error in image processing"}
    
    extracted_text = ocr_utils.extract_text_from_image("image.jpg")
    query = f"Extracted ingredients: {extracted_text}. Provide detailed information about these ingredients."
    response, history = llm_model.chat(tokenizer, query=query, history=history)
    history = history[-3:]
    print(response) 
    return {"response": response}

@app.post("/english_text_query")
async def process_text(query: str = Body(...)):
    global history, llm_model, tokenizer
    query = extract_text_from_multipart(query)
    print(query)
    response, history = llm_model.chat(tokenizer, query, history=history)
    history = history[-3:]
    print(response)
    return {"response": response}
    
@app.post("/tamil_image_query")
async def process_image(image: UploadFile = File(...)):
    global history, llm_model, tokenizer
    image_content = await image.read()
    try:
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")
    except Exception as e:
        print(e)
        return {"error": "Error in image processing"}
    
    extracted_text = ocr_utils.extract_text_from_image("image.jpg")
    query = f"Extracted ingredients: {extracted_text}. Provide detailed information about these ingredients."
    response, history = llm_model.chat(tokenizer, query=query, history=history)
    history = history[-3:]
    response = str(tamil_translate(response))
    print(response) 
    return {"response": response}

@app.post("/tamil_text_query")
async def process_text(query: str = Body(...)):
    global history, llm_model, tokenizer, translate
    query = extract_text_from_multipart(query)
    detected = translator.detect(query)
    if detected.lang == 'ta':
        query = translator.translate(query, dest='en').text
    print(query)
    response, history = llm_model.chat(tokenizer, query, history=history)
    history = history[-3:]
    response = str(tamil_translate(response))
    print(response)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)