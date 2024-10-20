from PIL import Image
import pytesseract

def extract_text_from_image(image_path):
    #pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text