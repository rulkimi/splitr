from PIL import Image
from dotenv import load_dotenv
import os
import io
import json
import uuid
from typing import Optional
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

def configure_model():
	genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
	return genai.GenerativeModel(
		model_name="gemini-1.5-flash",
		generation_config={
			"response_mime_type": "application/json",
			"temperature": 0.1,
			"top_p": 0.8,
		},
	)

def create_analysis_prompt(split_evenly: bool, num_people: int, remarks: Optional[str]) -> str:
	base_prompt = """Analyze the receipt with particular attention to indented modifications and their charges. Extract in this exact JSON format:
	{
		"receipt_id": string,
		"metadata": {
			"restaurant_name": string,
			"date": string,
			"time": string | null,
			"receipt_number": string | null
		},
		"items": [
			{
				"item_id": string,
				"name": string,
				"quantity": number,
				"unit_price": number,      # base_price + sum of modification prices
				"total_price": number      # unit_price * quantity
			}
		],
		"financial_summary": {
			"subtotal": number,
			"tax": number | null,
			"service_charge": number | null,
			"total": number
		}"""

	item_detection_rules = """
	
	CRITICAL ITEM DETECTION RULES:
	1. Main Item Format:
	   - Lines starting with "1x *" are main items
	   - Extract their base price from the "U.P" column
	
	2. Modification Format:
	   - Lines starting with "-" or indented under main items are modifications
	   - Look for additional prices on the same line as modifications
	   - Modifications may have their own price line below them
	   - Common formats:
	     * "- Cold"          # Look for price on next line
	     * "- Cold (Jumbo)"  # Look for price on same or next line
	     * "- thin"          # May have price of 0.00
	
	3. Price Association:
	   - ANY price appearing below a main item should be considered
	   - Check both "U.P" and "Price" columns for modification costs
	   - Include modifications even if price is 0.00
	
	4. Special Cases:
	   - For beverages, look specifically for:
	     * Temperature modifiers (Hot/Cold)
	     * Size modifiers (Regular/Large/Jumbo)
	   - For food items, look for:
	     * Preparation modifiers (thin, crispy, etc.)
	     * Add-ons or extras
	"""

	if split_evenly:
		split_details = f"""
		"split_details": {{
			"type": "equal",
			"num_people": {num_people},
			"unassigned_items": [
				{{
					"item_id": string,
					"name": string,
					"quantity": number,
					"unit_price": number,
					"total_price": number
				}}
			],
			"shares": [
				{{
					"person_id": string,
					"name": string,
					"share_amount": number
				}}
			]
		}}"""
	else:
		split_details = f"""
		"split_details": {{
			"type": "custom",
			"num_people": {num_people},
			"unassigned_items": [
				{{
					"item_id": string,
					"name": string,
					"quantity": number,
					"unit_price": number,
					"total_price": number
				}}
			],
			"shares": [
				{{
					"person_id": string,
					"name": string,
					"assigned_items": [
						{{
							"item_id": string,
							"name": string,
							"quantity": number,
							"unit_price": number,
							"total_price": number,
						}}
					],
					"share_amount": number
				}}
			]
		}}"""

	assignment_rules = f"""
	}}

	ASSIGNMENT RULES:
	1. Put all items in unassigned_items by default
	2. Only move items to assigned_items if explicitly mentioned in: {remarks if remarks else 'No remarks provided'}
	3. Even if there is no item assignments, please still reply with person_id and name with assigned_items as empty array [] and share amount of 0
	4. Match item names case-insensitive
	5. Generate unique IDs for all entities
	6. When assigning items, include ALL their modifications and associated prices
	7. PLEASE ASSIGN THE ITEMS FROM remarks"""

	return base_prompt + split_details + item_detection_rules + assignment_rules

async def analyze_receipt(file: UploadFile, split_evenly: bool, num_people: int, remarks: Optional[str]):
	try:
		image_data = await file.read()
		image = Image.open(io.BytesIO(image_data))
		
		model = configure_model()
		prompt = create_analysis_prompt(split_evenly, num_people, remarks)
		
		response = model.generate_content([prompt, image])
		
		try:
			response_text = response.text.strip()
			if response_text.startswith('```json\n'):
				response_text = response_text[7:-3]
			elif response_text.startswith('```\n'):
				response_text = response_text[4:-3]
			
			result = json.loads(response_text)
			if not all(key in result for key in ["receipt_id", "metadata", "items", "split_details"]):
				raise ValueError("Missing required fields in response")
			return result
		except json.JSONDecodeError as e:
			print(f"JSON Parse Error: {str(e)}")
			print(f"Response Text: {response.text}")
			raise HTTPException(status_code=422, detail="Failed to parse model response")
			
	except Exception as e:
		print(f"Error: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

app = FastAPI(title="Receipt Analysis API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "https://rulkimi.github.io"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.post("/analyze/")
async def analyze_receipt_endpoint(
	file: UploadFile = File(...),
	split_evenly: bool = False,
	num_people: int = 1,
	remarks: Optional[str] = None
):
	if not file.content_type.startswith('image/'):
		raise HTTPException(status_code=400, detail="File must be an image")
	
	if num_people < 1:
		raise HTTPException(status_code=400, detail="Number of people must be at least 1")
		
	return await analyze_receipt(file, split_evenly, num_people, remarks)