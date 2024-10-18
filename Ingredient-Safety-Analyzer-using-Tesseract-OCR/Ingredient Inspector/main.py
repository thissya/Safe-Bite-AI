import cv2
import pytesseract
import openpyxl

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def process_image(file_path):
    image = cv2.imread(file_path)
    product_text = pytesseract.image_to_string(image)
    print("Extracted Text:")
    print(product_text)

def main():
    file_path = input("Please enter the path to your image file (e.g., C:/path/to/image.jpg): ")
    
    process_image(file_path)

if __name__ == "__main__":
    main()
