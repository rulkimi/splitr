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

app = FastAPI(title="Receipt Analysis API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "https://rulkimi.github.io"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

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

def create_analysis_prompt() -> str:
	base_prompt = """Analyze the receipt with particular attention to indented modifications and their charges. Extract in this exact JSON format:
	{
		"restaurant_name": string,
		"date": string,
		"time": string | null,
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
			"subtotal": number | 0,
			"tax": number | 0,
			"service_charge": number | 0,
			"total": number | 0,
			"total_paid": 0 // always zero for now
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

	return base_prompt + item_detection_rules

@app.post("/analyze/")
async def analyze_receipt(file: UploadFile):
	try:
		image_data = await file.read()
		image = Image.open(io.BytesIO(image_data))
		
		model = configure_model()
		prompt = create_analysis_prompt()
		
		response = model.generate_content([prompt, image])
		
		try:
			response_text = response.text.strip()
			if response_text.startswith('```json\n'):
				response_text = response_text[7:-3]
			elif response_text.startswith('```\n'):
				response_text = response_text[4:-3]
			
			result = json.loads(response_text)
			return result
		except json.JSONDecodeError as e:
			print(f"JSON Parse Error: {str(e)}")
			print(f"Response Text: {response.text}")
			raise HTTPException(status_code=422, detail="Failed to parse model response")
			
	except Exception as e:
		print(f"Error: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")