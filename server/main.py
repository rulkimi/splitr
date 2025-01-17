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
    You are an expert in document analysis, specializing in extracting key details from bills and receipts. 
    Please analyze the attached image of a bill and extract the following details in JSON format:
    {{
        "result": {{
            "restaurant_name": "name_of_the_restaurant",  # Extract the name of the restaurant or vendor
            "date": "date_of_purchase",  # Extract the date of the bill
            "items": [  # List of items purchased
                {{
                    "name": "item_name",  # Name of the item
                    "amount": "total_amount_for_item",  # Total amount for the item For example 1, 2, 3, etc
                    "price": "unit_price"  # Price per unit/item
                }},
                ...
            ],
            "subtotal": "subtotal_amount",  # Extract the subtotal of the bill
            "tax": "tax_amount",  # Extract the tax amount
            "total": "total_amount"  # Extract the total amount (including tax)
        }}
    }}

    If any of this information is missing, use "null" for those fields.

    Additional remarks: {remarks if remarks else "None"}
    """

    # Instructions for splitting the bill
    if split_evenly:
        split_prompt = f"""
        IMPORTANT! If the items are not explicitly assigned to specific people in the additional remarks section, add them to the "unassigned_items" section:
        {{
            "unassigned_items": [  # List of items that are unassigned
                {{
                    "name": "item_name",  # Name of the unassigned item
                    "amount": "amount",  # Total amount for the unassigned item, for example 1, 2, 3, etc
                    "price": "unit_price"  # Price of the unassigned item
                }},
                ...
            ]
        }}

        Since the "split_evenly" flag is {str(split_evenly).lower()}, divide the total amount equally among {num_people} people and show their share like this:
        {{
            "people_share": [
                {{
                    "name": "PERSON_1",  # Name of the first person
                    "total": "share_amount_1"  # Share of the first person (equal share)
                }},
                ...
            ]
        }}
        """
    else:
        split_prompt = f"""
        IMPORTANT! If the items are not explicitly assigned to specific people in the additional remarks section, add them to the "unassigned_items" section:
        {{
            "unassigned_items": [  # List of items that are unassigned
                {{
                    "name": "item_name",  # Name of the unassigned item
                    "amount": "amount",  # Total amount for the unassigned item, for example 1, 2, 3, etc
                    "price": "unit_price"  # Price of the unassigned item
                }},
                ...
            ]
        }}

        Since the "split_evenly" flag is {str(split_evenly).lower()}, assign items to {num_people} individuals based on the total amount. If there are any unassigned items, leave it blank. The output should show each person's items and their share of the total, like this:
        {{
            "people_share": [
                {{
                    "name": "PERSON_1",  # Name of the first person
                    "items": [  # List of items assigned to this person
                        {{
                            "name": "item_name",  # Name of the item
                            "amount": "item_amount",  # Total amount of this item
                            "price": "item_price"  # Price of this item
                        }},
                        ...
                    ],
                    "total": "share_amount_1"  # The total share for this person
                }},
                ...
            ]
        }}
        """

    # Combine the common prompt and split-specific instructions
    final_prompt = common_prompt + split_prompt

    print(final_prompt)

    # Send the prompt and image to the model
    identification_response = model.generate_content([final_prompt, image])
    
    try:
        bill_details = json.loads(identification_response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse the response. Ensure the input image is a valid bill."}

    # Return the full response with bill details and people's share
    return bill_details

app = FastAPI()

origins = ["http://localhost:5173", "https://rulkimi.github.io"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_bill(file: UploadFile = File(...), split_evenly: bool = False, num_people = "0", remarks: str = ""):
    try:
        bill_details = await split_bills(file, split_evenly, num_people, remarks)
        return bill_details
    except Exception as e:
        return {"error": str(e)}
