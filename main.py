from PIL import Image
from dotenv import load_dotenv
import os
import io
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

def configure_model():
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    return genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"},
    )

async def split_bills(file, split_evenly, num_people, remarks):
    image = Image.open(io.BytesIO(await file.read()))

    model = configure_model()

    # Create the common part of the prompt
    common_prompt = f"""
      You are an expert in document analysis, specializing in extracting information from bills and receipts. 
      Please analyze the attached image of a bill and extract the following details in JSON format: 
      {{
        "restaurant_name": "...",
        "date": "...",
        "items": [
          {{
            "name": "...",
            "amount": "...",
            "price": "..."
          }}
        ],
        "subtotal": "...",
        "tax": "...",
        "total": "..."
      }}
      If any information is unavailable, use null for its value.

      Additional remarks:
      {remarks if remarks else "None"}
    """

    # Modify prompt based on the split_evenly flag
    if split_evenly:
        split_prompt = f"""
        Please split the total bill of {num_people} people evenly. Provide the share for each person, ensuring the total amount is equally divided.
        The final output should contain a list of people's shares, like so:
        {{
          "people_share": [
            {{
              "name": "PERSON 1",
              "total": "share_amount"
            }},
            ...
          ]
        }}
        """
    else:
        split_prompt = f"""
        Please split the bill among {num_people} people based on the items. Assign each item to a person, and if any items remain unassigned, distribute them equally.
        The final output should contain the items assigned to each person along with their share of the total amount, add this item to the response object.
        {{
          "people_share": [
            {{
              "name": "PERSON 1",
              "items": [
                {{
                  "name": "item_name",
                  "amount": "amount",
                  "price": "price"
                }},
                ...
              ],
              "total": "share_amount"
            }},
            ...
          ]
        }}
        """
    
    # Combine common part with specific split instructions
    final_prompt = common_prompt + split_prompt

    # Send the prompt and image to the model
    identification_response = model.generate_content([final_prompt, image])
    
    try:
        bill_details = json.loads(identification_response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse the response. Ensure the input image is a valid bill."}

    # Return the full response with bill details and people's share
    return bill_details

# Example usage with FastAPI:
#
# from fastapi import FastAPI, File, UploadFile
#
app = FastAPI()

@app.post("/upload/")
async def upload_bill(file: UploadFile = File(...), split_evenly: bool = True, num_people: int = 0, remarks: str = ""):
    try:
        bill_details = await split_bills(file, split_evenly, num_people, remarks)
        return {"bill_details": bill_details}
    except Exception as e:
        return {"error": str(e)}
