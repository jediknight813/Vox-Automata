import openai
import os
from PromptFormating import GptCharacterGenerationPrompt
import guidance
from dotenv import load_dotenv
load_dotenv()


def getChatGPTResponse(PromptList):
    ORGANIZATION = os.environ.get("ORGANIZATION")
    API_KEY = os.environ.get("OPENAI_API_KEY")
    openai.organization = ORGANIZATION
    openai.api_key = API_KEY

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=PromptList
    )

    result = ''
    for choice in response.choices:
        result += choice.message.content    

    return result


def gpt_generate_character(UserPrompt):
    ORGANIZATION = os.getenv("ORGANIZATION")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    openai.organization = ORGANIZATION
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

    guidance.llm = guidance.llms.OpenAI("gpt-3.5-turbo")

    response = GptCharacterGenerationPrompt(
        user_prompt=UserPrompt
    ) 

    return response.variables()
