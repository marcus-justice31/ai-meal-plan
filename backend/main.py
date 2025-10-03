from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

gender = ""
age = ""
height_cm = 0
weight_kg = 0
body_fat_percentage = 0
activity_level = ""
goal = ""
diatary_restrictions = ""
meals_per_day = 0



response = client.responses.create(
    model="gpt-5-nano",
    input="Write me a 3 line poem about the colour blue"
)

with open("testWrite.txt", "a") as file:
    file.write(response.output_text)

print(response.output_text)
