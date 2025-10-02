from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

response = client.responses.create(
    model="gpt-5-nano",
    input="Write me a 3 line poem about the colour blue"
)

with open("testWrite.txt", "a") as file:
    file.write(response.output_text)

print(response.output_text)
