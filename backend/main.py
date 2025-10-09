from pymongo import MongoClient
from pydantic import BaseModel, Field
from datetime import date
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi import Body
from datetime import datetime

from openai import OpenAI
from dotenv import load_dotenv
import os

app = FastAPI()

#------ MongoDB connection uri ------#
uri = "mongodb+srv://marcusjusticeuy_db_user:cMGtsvEm2S450XEG@ai-meal-plan.roiylcu.mongodb.net/?retryWrites=true&w=majority&appName=Ai-Meal-Plan"
mongo_client = MongoClient(uri)

#------ Database and collections ------#
db = mongo_client.meals_db
user_collection = db["users"]
meals_collection = db["meals"]

#------ User Model ------#
class User(BaseModel):
    username: str
    password: str
    gender: str
    birthday: str
    height_cm: int
    weight_kg: int
    dietary_restrictions: List[str] = Field(default_factory=lambda: ['none']) # makes it so that it is not shared and mutable

#------ Request Models ------#
class LoginRequest(BaseModel):
    username: str
    password: str

class MealPlanRequest(BaseModel):
    activity_level: str
    goal: str
    meals_per_day: int = 3

#------ Add CORS middleware ------#
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  
)
#------ Functions ------#
def calculateAge(username: str):
    user = user_collection.find_one({"username": username})
    if user:
        birthday_str = user["birthday"]

        birthday_date = datetime.strptime(birthday_str, "%Y-%m-%d").date() # convert string to datetime.date

        today = date.today()
        age = today.year - birthday_date.year - ((today.month, today.day) < (birthday_date.month, birthday_date.day))

        return age
    else:
        raise HTTPException(status_code=404, detail="User not found")

def calculateBMI(username: str):
    user = user_collection.find_one({"username": username})
    if user:
        weight_kg = user["weight_kg"]
        height_m = user["height_cm"] / 100

        BMI = weight_kg / (height_m ** 2)

        return BMI
    else:
        raise HTTPException(status_code=404, detail="User not found")

#-------- USER APIs --------#
@app.post("/user/login")
def login(request: LoginRequest):
    # Find the user by username in MongoDB
    user = user_collection.find_one({"username": request.username})
    
    if user:
        if user["password"] == request.password:
            return {"Login": "Successful"}
        else:
            raise HTTPException(status_code=400, detail="Invalid password")
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/user/create")
def createUser(new_user: User = Body(...)): # expects the data in the request body as JSON (because I created a pydantic User class already)
    # Check if the user already exists
    existing_user = user_collection.find_one({"username": new_user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Insert the new user into MongoDB
    user_collection.insert_one(new_user.model_dump())
    
    return {"message": "Successful"}

@app.post("/user/{username}/generate_meal_plan")
def generate_meal_plan(username: str, request: MealPlanRequest):
    user = user_collection.find_one({"username": username})
    if user:
        age = calculateAge(username)
        BMI = calculateBMI(username)

        load_dotenv()

        openai_client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )

        prompt_input = {
            "task": "weekly_meal_plan",
            "inputs": {
                "gender": user["gender"],
                "age": age,
                "height_cm": user["height_cm"],
                "weight_kg": user["weight_kg"],
                "BMI": BMI,
                "activity_level": request.activity_level,
                "goal": request.goal,
                "preferences": {
                "diet_type": "high protein",
                "restrictions": user["dietary_restrictions"],
                "meals_per_day": request.meals_per_day
                }
            }
        }

        instructions = """
                You are a certified nutritionist and meal planner AI.

                1. Calculate the user's estimated maintenance calories and macronutrient targets.
                2. Adjust the plan for their goal (e.g., calorie deficit for cutting).
                3. Create a balanced 7-day meal plan following their restrictions and meals per day.
                4. Return the result in valid JSON format.

                Output JSON:
                {
                "macroTargets": {"calories": int, "protein_g": int, "carbs_g": int, "fat_g": int},
                "week": [
                    {"day": "Monday", "meals": [{"name": str, "calories": int, "protein": int, "carbs": int, "fat": int}],
                    "totalDailyCalories": int, "totalDailyMacros": {"protein": int, "carbs": int, "fat": int}}
                ]
                }
                """
        
        response = openai_client.responses.create(
            model="gpt-5-nano",
            reasoning={"effort": "low"},
            instructions=instructions,
            input=str(prompt_input)
        )

        with open("testWrite2.txt", "a") as file:
            file.write(response.output_text)

    else:
        raise HTTPException(status_code=404, detail="User not found")



    return {"message": "Successful"}



# # Create new user
# new_user = User(username="username", password="password", gender="male", birthday="2003-1-31", height_cm=175, weight_kg=75, dietary_restrictions=['none'])

# # Insert new user into MongoDB
# user_collection.insert_one(new_user.model_dump())

# print("user created successfully")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
