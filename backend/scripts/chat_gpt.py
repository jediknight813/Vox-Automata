import openai
import os


def getChatGPTResponse(PromptList):
    ORGANIZATION = os.environ.get("ORGANIZATION")
    API_KEY = os.environ.get("API_KEY")
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