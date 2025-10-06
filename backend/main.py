from openai import OpenAI
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from pydantic import BaseModel, Field
from datetime import date
from typing import List

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

## MongoDB connection uri ##
uri = "mongodb+srv://marcusjusticeuy_db_user:cMGtsvEm2S450XEG@ai-meal-plan.roiylcu.mongodb.net/?retryWrites=true&w=majority&appName=Ai-Meal-Plan"
client = MongoClient(uri)

## Database and collections ##
db = client.meals_db
user_collection = db["users"]
meals_collection = db["meals"]

# User model for login and user creation
class User(BaseModel):
    username: str
    password: str
    gender: str
    birthday: str
    height_cm: int
    weight_kg: int
    dietary_restrictions: List[str] = Field(default_factory=lambda: ['none']) # makes it so that it is not shared and mutable



# Create new user
new_user = User(username="username", password="password", gender="male", birthday="2003-1-31", height_cm=175, weight_kg=75, dietary_restrictions=['none'])

# Insert new user into MongoDB
user_collection.insert_one(new_user.model_dump())

print("user created successfully")


# gender = ""
# age = 0
# height_cm = 0
# weight_kg = 0
# body_fat_percentage = 0
# activity_level = ""
# goal = ""
# diatary_restrictions = [""]
# meals_per_day = 0

# gender = "male"
# age = 22
# height_cm = 175
# weight_kg = 65
# body_fat_percentage = 18
# activity_level = "4x weights/week"
# goal = "cut to 15"
# diatary_restrictions = ["no dairy"]
# meals_per_day = 3

# output_format = "Return a JSON object with a 'week' array. Each element has 'day', 'meals' (array of meal objects with name, calories, protein, carbs, fat). Also include total daily calories and macros."

# prompt = {
#     "task": "weekly_meal_plan",
#     "inputs": {
#         "gender": gender,
#         "age": age,
#         "height_cm": height_cm,
#         "weight_kg": weight_kg,
#         "body_fat_percent": body_fat_percentage,
#         "activity_level": activity_level,
#         "goal": goal,
#         "preferences": {
#         "diet_type": "high protein",
#         "restrictions": diatary_restrictions,
#         "meals_per_day": meals_per_day
#         }
#     }
# }

# response = client.responses.create(
#     model="gpt-5-nano",
#     reasoning={"effort": "low"},
#     instructions=str(output_format),
#     input=str(prompt)
# )

# with open("testWrite.txt", "a") as file:
#     file.write(response.output_text)

# print(response.output_text)
