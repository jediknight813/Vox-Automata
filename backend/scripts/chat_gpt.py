import openai
import os
from PromptFormating import GptCharacterGenerationPrompt, GptScenarioGenerationPrompt
from dotenv import load_dotenv
load_dotenv()


def configure_vars():
    ORGANIZATION = os.getenv("ORGANIZATION")
    API_KEY = os.getenv("API_KEY")

    if "OPENAI_API_BASE" in os.environ:
        del os.environ["OPENAI_API_BASE"]

    if "OPENAI_API_HOST" in os.environ:
        del os.environ["OPENAI_API_HOST"]

    if "OPENAI_API_KEY" in os.environ:
        del os.environ["OPENAI_API_KEY"]

    openai.organization = ORGANIZATION
    openai.api_key = API_KEY
    os.environ["OPENAI_API_KEY"] = API_KEY


def getChatGPTResponse(PromptList):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=PromptList
    )

    result = ''
    for choice in response.choices:
        result += choice.message.content    

    return result


def gpt_generate_character(UserPrompt):
    import guidance
    configure_vars()    

    guidance.llm = guidance.llms.OpenAI("gpt-3.5-turbo")

    response = GptCharacterGenerationPrompt(
        user_prompt=UserPrompt
    ) 

    return response.variables()


def gpt_generate_scenario(character_one_name, character_two_name, character_one_description, character_two_description, scenario_prompt):
    import guidance
    configure_vars()

    guidance.llm = guidance.llms.OpenAI("gpt-3.5-turbo")

    response = GptScenarioGenerationPrompt(
        character_one_name=character_one_name,
        character_two_name=character_two_name,
        character_one_description=character_one_description,
        character_two_description=character_two_description,
        scenario_prompt=scenario_prompt
    ) 

    return response.variables()
