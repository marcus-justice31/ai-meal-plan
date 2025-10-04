from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# gender = ""
# age = 0
# height_cm = 0
# weight_kg = 0
# body_fat_percentage = 0
# activity_level = ""
# goal = ""
# diatary_restrictions = [""]
# meals_per_day = 0

gender = "male"
age = 22
height_cm = 175
weight_kg = 65
body_fat_percentage = 18
activity_level = "4x weights/week"
goal = "cut to 15"
diatary_restrictions = ["no dairy"]
meals_per_day = 3

output_format = "Return a JSON object with a 'week' array. Each element has 'day', 'meals' (array of meal objects with name, calories, protein, carbs, fat). Also include total daily calories and macros."

prompt = {
    "task": "weekly_meal_plan",
    "inputs": {
        "gender": gender,
        "age": age,
        "height_cm": height_cm,
        "weight_kg": weight_kg,
        "body_fat_percent": body_fat_percentage,
        "activity_level": activity_level,
        "goal": goal,
        "preferences": {
        "diet_type": "high protein",
        "restrictions": diatary_restrictions,
        "meals_per_day": meals_per_day
        }
    }
}

response = client.responses.create(
    model="gpt-5-nano",
    reasoning={"effort": "low"},
    instructions=str(output_format),
    input=str(prompt)
)

with open("testWrite.txt", "a") as file:
    file.write(response.output_text)

print(response.output_text)
