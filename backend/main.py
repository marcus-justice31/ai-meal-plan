from pymongo import MongoClient
from pydantic import BaseModel, Field
from datetime import date
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi import Body
from datetime import datetime

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



#------ Add CORS middleware ------#
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  
)

#-------- USER APIs --------#
@app.get("/user/login")
def login(username: str, pswd: str):
    # Find the user by username in MongoDB
    user = user_collection.find_one({"username": username})
    
    if user:
        if user["password"] == pswd:
            return {"Login": "Successful"}
        else:
            raise HTTPException(status_code=400, detail="Invalid password")
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/user/create")
def createUser(new_user: User = Body(...)):
    # Check if the user already exists
    existing_user = user_collection.find_one({"username": new_user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # new_user = User(
    #             username=username, 
    #             password=password, 
    #             gender=gender, 
    #             birthday=birthday, 
    #             height_cm=height_cm, 
    #             weight_kg=weight_kg, 
    #             dietary_restrictions=dietary_restrictions
    #         )
    
    # Insert the new user into MongoDB
    user_collection.insert_one(new_user.model_dump())
    
    return {"message": "Successful"}

@app.get("/user/{username}/generate_meal_plan")
def generate_meal_plan(username: str, gender: str, height_cm: int, weight_kg: int, dietary_restrictions: List[str]):
    user = user_collection.find_one({"username": username})

    return {"message": "Meal plan generated successfully"}



# # Create new user
# new_user = User(username="username", password="password", gender="male", birthday="2003-1-31", height_cm=175, weight_kg=75, dietary_restrictions=['none'])

# # Insert new user into MongoDB
# user_collection.insert_one(new_user.model_dump())

# print("user created successfully")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
