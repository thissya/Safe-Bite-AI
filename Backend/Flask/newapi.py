from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
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
from googletrans import Translator

load_dotenv()

app = FastAPI()

class ValidateRequest(BaseModel):
    user_id: str
    message: str
    language:str

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
    device_map="auto"
)

ngrok_auth_token = "2lC10VNMNNHozy9qU2wBzosN3at_3QYjZW2FJ2sr1po7qXqqs"
if ngrok_auth_token is None:
    raise ValueError("NGROK_AUTH_TOKEN is not set")
ngrok.set_auth_token(ngrok_auth_token)

listener = ngrok.forward("127.0.0.1:8000", authtoken_from_env=True, domain="sterling-python-willingly.ngrok-free.app")

user_histories = {}

translator = Translator()

def query_model(system_message, user_message, history, temperature=0.7, max_length=1024):
    user_message = "Question: " + user_message + " Answer:"
    messages = history + [{"role": "user", "content": user_message}]

    prompt = pipeline.tokenizer.apply_chat_template(
        messages, 
        tokenize=False, 
        add_generation_prompt=True
    )

    terminators = [
        pipeline.tokenizer.eos_token_id,
        pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]
    
    sequences = pipeline(
        prompt,
        do_sample=True,
        top_p=0.9,
        temperature=temperature,
        eos_token_id=terminators,
        max_new_tokens=max_length,
        return_full_text=False,
        pad_token_id=pipeline.model.config.eos_token_id
    )
    answer = sequences[0]['generated_text']
    return answer, messages

system_message = """
    You are an AI assistant specialized in providing personalized food consumption advice based on ingredient lists from packaged food products. 
    Your role is to help users with specific medical conditions such as allergies, diabetes, hypertension, or food intolerances make informed decisions about their diet. 
    When given a list of ingredients extracted from a food label, you should provide comprehensive information about each ingredient, including its nutritional value, potential health benefits, and any known risks or side effects.
    You should also analyze the ingredients in the context of the user's health profile, which includes details like allergies, medical conditions, and dietary restrictions.
    Your response should identify harmful or potentially risky ingredients, provide personalized recommendations on whether the product is suitable for regular consumption, and offer insights on both short-term and long-term health effects.
    Additionally, suggest safer alternatives if necessary and track the user's ingredient consumption over time. "
    Your goal is to enhance the user's ability to make informed decisions about their diet, improving their overall health and well-being through convenience and accuracy.
    dont return the text in the json format."""

@app.post('/message')
async def message(request: ValidateRequest):
    print("Incoming Request:", request.json())
    try:
        global user_histories
        user_id = request.user_id
        user_message = request.message
        language = request.language
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])
        response, updated_history = query_model(system_message, user_message, history)
        user_histories[user_id] = updated_history[-3:]  

        try:
            print(f"Translating response to {language}: {response}")
            if language.lower() == "tamil":
                translated_response = translator.translate(response, src='en', dest='ta').text
                print(f"Translated Response: {translated_response}")
            elif language.lower() == "english":
                translated_response = response
            else:
                raise ValueError("Unsupported language")
            return JSONResponse(status_code=200, content={"response": translated_response})
        except Exception as e:
            print(f"Translation Error: {e}")
            return JSONResponse(status_code=500, content={"response": "Translation failed. Please try again."})
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/chat')
async def chat(user_id: str = Form(...), image: UploadFile = File(...), message: str = Form(...),language: str = Form(...)):
    print(f"User ID: {user_id}, Message: {message}, Language: {language}")
    try:
        global user_histories
        image_content = await image.read()
        with Image.open(io.BytesIO(image_content)) as img:
            img = img.convert("RGB")
            img.save("image.jpg")
        
        extracted_text = ocr_utils.extract_text_from_image("image.jpg")
        
        query = f"""Extracted ingredients: {extracted_text}. Provide detailed information about these ingredients and also
        provide whether user with {message} can consume it or not. provide the side effects of consuming this product for a 
        long term and short term. provide within 200 words"""

        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])
        response, updated_history = query_model(system_message, query, history)
        user_histories[user_id] = updated_history[-3:]

        try:
            print(f"Translating response to {language}: {response}")
            if language.lower() == "tamil":
                translated_response = translator.translate(response, src='en', dest='ta').text
                print(f"Translated Response: {translated_response}")
            elif language.lower() == "english":
                translated_response = response
            else:
                raise ValueError("Unsupported language")
            return JSONResponse(status_code=200, content={"response": translated_response})
        except Exception as e:
            print(f"Translation Error: {e}")
            return JSONResponse(status_code=500, content={"response": "Translation failed. Please try again."})

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)