import os
from dotenv import load_dotenv
import json

load_dotenv()
from PromptFormating import (
    AlpacaFormat,
    Pygmalion2Format,
    ScenarioLocation,
    LocalCharacterGeneration,
    LocalSenarioGenerationV2,
    LocalSenarioGeneration,
    MagpieFormat,
    NpcThinking,
    LocalCharacterGenerationV2,
    DolphinMixtralFormat,
)


def configure_vars():
    TEXT_GENERATION_LOCAL_URL = os.environ.get("TEXT_GENERATION_LOCAL_URL")
    os.environ["OPENAI_API_KEY"] = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    os.environ["OPENAI_API_BASE"] = "http://" + TEXT_GENERATION_LOCAL_URL + "/v1"
    os.environ["OPENAI_API_HOST"] = "http://" + TEXT_GENERATION_LOCAL_URL


def generate_scenario_location(scenario):
    import guidance

    configure_vars()
    guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)

    ai_response = ScenarioLocation(
        scenario=scenario,
    )

    bot_response = ai_response.variables()["response"].strip()
    return bot_response


def local_generate_scenario(
    character_one_name,
    character_two_name,
    character_one_description,
    character_two_description,
    scenario_prompt,
):
    import guidance

    configure_vars()
    guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)

    response = LocalSenarioGenerationV2(
        character_one_name=character_one_name,
        character_two_name=character_two_name,
        character_one_description=character_one_description,
        character_two_description=character_two_description,
        scenario_prompt=scenario_prompt,
    )

    return response.variables()


def generate_character_local(character_prompt):
    import guidance

    configure_vars()
    guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)

    ai_response = LocalCharacterGenerationV2(
        character_prompt=character_prompt,
    )

    return ai_response.variables()


def generate_response(gameData, userMessage, promptFormat="Alpaca"):
    import guidance

    configure_vars()
    guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)
    MODIFIER = os.environ.get("MODIFIER")

    if promptFormat == "Alpaca":
        chat_history_string = create_chat_history_string(gameData)
        npc_response = AlpacaFormat(
            npc_name=gameData["npc"]["name"],
            npc_persona=create_npc_persona(gameData["npc"]),
            player_name=gameData["player"]["name"],
            scenario=gameData["scenario"]["scenario"],
            question=userMessage,
            history=chat_history_string,
            modifier=MODIFIER,
        )

        bot_response = npc_response.variables()["response"].strip()

        return bot_response

    if promptFormat == "Pygmalion2Format":
        chat_history_string = create_chat_history_string(
            gameData, "<|user|> ", "<|model|> "
        )
        npc_response = Pygmalion2Format(
            npc_name=gameData["npc"]["name"],
            npc_persona=create_npc_persona(gameData["npc"]),
            player_name=gameData["player"]["name"],
            scenario=gameData["scenario"]["scenario"],
            question=userMessage,
            history=chat_history_string,
        )

        bot_response = npc_response.variables()["response"].strip()

        return bot_response

    if promptFormat == "DolphinMixtralFormat":
        chat_history_string = create_chat_history_string(
            gameData, "<|im_start|>user", "<|im_start|>assistant", "<|im_end|>"
        )

        print(chat_history_string)

        npc_response = DolphinMixtralFormat(
            npc_name=gameData["npc"]["name"],
            npc_persona=create_npc_persona(gameData["npc"]),
            player_name=gameData["player"]["name"],
            player_details=gameData["player"]["wearing"],
            scenario=gameData["scenario"]["scenario"],
            question=userMessage,
            history=chat_history_string,
        )

        bot_response = npc_response.variables()["response"].strip()

        return bot_response

    if promptFormat == "MagpieFormat":
        chat_history_string = create_chat_history_string(gameData)
        npc_response = MagpieFormat(
            npc_name=gameData["npc"]["name"],
            npc_persona=create_npc_persona(gameData["npc"]),
            player_name=gameData["player"]["name"],
            scenario=gameData["scenario"]["scenario"],
            question=userMessage,
            history=chat_history_string,
        )

        bot_response = npc_response.variables()["response"].strip()

        return bot_response

    if promptFormat == "NpcThinking":
        chat_history_string = create_chat_history_string(gameData)
        npc_response = NpcThinking(
            npc_name=gameData["npc"]["name"],
            npc_persona=create_npc_persona(gameData["npc"]),
            player_name=gameData["player"]["name"],
            scenario=gameData["scenario"]["scenario"],
            question=userMessage,
            history=chat_history_string,
        )

        bot_response = (
            npc_response.variables()["thoughts"].strip()
            + " "
            + npc_response.variables()["response"].strip()
        )

        return bot_response


def create_npc_persona(npcData):
    persona = f"{npcData['name'].capitalize()} is a {npcData['age']} {npcData['gender']} with a {npcData['appearance']} build. "
    persona += f"{npcData['name'].capitalize()} has a {npcData['personality']} personality and is wearing {npcData['wearing']}."

    return persona


def create_chat_history_string(gameData, player_prefix="", npc_prefix="", end_token=""):
    chat_history_string = ""

    if len(gameData["messages"]) >= 1:
        for message in gameData["messages"]:
            if message["type"] == "bot":
                chat_history_string += (
                    "\n"
                    + npc_prefix
                    + gameData["npc"]["name"]
                    + ": "
                    + message["message"]
                    + end_token
                )
            if message["type"] == "user":
                chat_history_string += (
                    "\n"
                    + player_prefix
                    + gameData["player"]["name"]
                    + ": "
                    + message["message"]
                    + end_token
                )

    return chat_history_string
