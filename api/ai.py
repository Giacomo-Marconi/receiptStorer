import google.generativeai as genai
import PIL.Image
import json

CONFIG = {
  "temperature": 0.4,
  "max_output_tokens": 150,
}

genai.configure(api_key="AIzaSyAe8K6eouqBqfJJ9evlC6E8_omvsfqbhlA")
model = genai.GenerativeModel(model_name='gemini-1.5-flash', generation_config=CONFIG)


def getData(image):
    result = model.generate_content([
    """You are a vision data extraction API capable of extracting data from an image. 
        extract date, time, total amount, merchant name, address, city and number about the receipt in the image.
        Please respond with follow the JSON format without any formatting or char.
        The JSON schema should include:
          {
            "date": "yyyy:mm:dd",
            "time": "hh:mm:ss",
            "total": double,
            "city": "string",
            "coutry": "string",
            "address": "string",
            "merchant_name": "string",
            "number": "string"
          }""", PIL.Image.open(image)])
    
    data = result.text.strip()
    # print(data)
    open = data.find('{')
    close = data.rfind('}')+1
    data = data[open:close]
    return json.loads(data)


if(__name__ == "__main__"):
    print(getData('./imgSaved/test.png'))

    
    ''''''
    


