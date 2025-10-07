from openai import OpenAI
from dotenv import load_dotenv
import os

#------ OpenAI API connection ------#
load_dotenv()

openai_client = OpenAI(
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

# output_format = "Return a JSON object with a 'week' array. Each element has 'day', 'meals' (array of meal objects with name, calories, protein, carbs, fat). Also include total daily calories and macros."

prompt_input = {
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

with open("testWrite.txt", "a") as file:
    file.write(response.output_text)

print(response.output_text)