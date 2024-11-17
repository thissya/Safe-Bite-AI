from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from PIL import Image
import io
import uvicorn
from googletrans import Translator
from dotenv import load_dotenv
import logging
import ocr_utils  # Assuming this contains a utility for OCR processing

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a data model for text-based requests
class ValidateRequest(BaseModel):
    user_id: str
    message: str
    language: str

# Logging setup
logging.basicConfig(level=logging.DEBUG)

# Load model and tokenizer
model_path = "/kaggle/input/llama-3/transformers/8b-chat-hf/1"  # Replace with the actual model path
try:
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    text_pipeline = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map="auto"
    )
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise RuntimeError("Model loading failed")

# Initialize Google Translator
translator = Translator()

# Global user histories to maintain chat context
user_histories = {}

# Define system message for context
system_message = """
You are an AI assistant specializing in providing personalized food consumption advice based on ingredient lists from packaged food products. 
Your role is to help users with specific medical conditions such as allergies, diabetes, hypertension, or food intolerances make informed decisions about their diet. 
Your response should include ingredient details, risks, suitability for the user’s conditions, and recommendations within 200 words.
"""

# Helper function to query the language model
def query_model(system_message, user_message, history, temperature=0.7, max_length=1024):
    try:
        prompt = "\n".join([f"{m['role']}: {m['content']}" for m in history]) + f"\nUser: {user_message}\nAssistant:"
        logging.debug(f"Model prompt: {prompt}")
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
        return answer.strip(), history + [{"role": "user", "content": user_message}, {"role": "assistant", "content": answer.strip()}]
    except Exception as e:
        logging.error(f"Error during model query: {e}")
        raise ValueError("Model failed to generate a response")

# Endpoint to handle text-based messages
@app.post("/message")
async def handle_message(request: ValidateRequest):
    try:
        user_id = request.user_id
        user_message = request.message
        language = request.language.lower()

        # Retrieve or initialize chat history
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(system_message, user_message, history)
        user_histories[user_id] = updated_history[-3:]  # Limit history to the last 3 exchanges

        # Handle translation if needed
        if language == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
        elif language == "english":
            translated_response = response
        else:
            raise ValueError("Unsupported language")

        return JSONResponse(status_code=200, content={"response": translated_response})
    except Exception as e:
        logging.error(f"Error in /message endpoint: {e}")
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
            img.save("uploaded_image.jpg")

        # Extract text from the image
        extracted_text = ocr_utils.extract_text_from_image("uploaded_image.jpg")
        logging.debug(f"Extracted text: {extracted_text}")

        # Prepare query with extracted text
        query = f"""
        Extracted ingredients: {extracted_text}.
        Provide detailed information about these ingredients and determine if a user with the condition '{message}' can consume them. 
        Include potential short-term and long-term side effects, within 200 words.
        """
        history = user_histories.get(user_id, [{"role": "system", "content": system_message}])

        # Generate response
        response, updated_history = query_model(system_message, query, history)
        user_histories[user_id] = updated_history[-3:]  # Limit history to the last 3 exchanges

        # Handle translation if needed
        language = language.lower()
        if language == "tamil":
            translated_response = translator.translate(response, src="en", dest="ta").text
        elif language == "english":
            translated_response = response
        else:
            raise ValueError("Unsupported language")

        return JSONResponse(status_code=200, content={"response": translated_response})
    except Exception as e:
        logging.error(f"Error in /chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Main entry point to run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
