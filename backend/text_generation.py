import os
from dotenv import load_dotenv
import json
load_dotenv()

import asyncio
import concurrent.futures


TEXT_GENERATION_LOCAL_URL = os.environ.get("TEXT_GENERATION_LOCAL_URL")
MODIFIER = os.environ.get("MODIFIER")

# Ai setup.
os.environ["OPENAI_API_KEY"] = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # can be anything
os.environ["OPENAI_API_BASE"] = "http://"+TEXT_GENERATION_LOCAL_URL+"/v1"
os.environ["OPENAI_API_HOST"] = "http://"+TEXT_GENERATION_LOCAL_URL
import guidance
guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)


def generate_response(gameData, userMessage):
    chat_history_string = create_chat_history_string(gameData)

    response = guidance('''
        ### Instruction:
        {{npc_name}}'s Persona: {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.

        Scenario: {{scenario}}.
        {{modifier}}

        {{history}}
        {{player_name}}: {{question}}

        ### Response:
        {{npc_name}}: {{~gen 'response' temperature=0.8 stop='\n' }}
    ''')

    npc_response = response(
        npc_name=gameData["npc"]["name"],
        npc_persona=create_npc_persona(gameData["npc"]),
        player_name=gameData["player"]["name"],
        scenario=gameData["scenario"]["scenario"],
        question=userMessage,
        history=chat_history_string,
        modifier=MODIFIER
    )

    bot_response = npc_response.variables()["response"].strip()

    return bot_response


def get_or_create_eventloop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError as ex:
        if "There is no current event loop in thread" in str(ex):
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            return asyncio.get_event_loop()


def generate_response_in_thread(game_data, user_message):
    loop = get_or_create_eventloop()
    return loop.run_in_executor(None, generate_response, game_data, user_message)


def create_npc_persona(npcData):
    persona = f"{npcData['name'].capitalize()} is a {npcData['age']} {npcData['gender']} with a {npcData['appearance']} build. "
    persona += f"{npcData['name'].capitalize()} has a {npcData['personality']} personality and is wearing {npcData['wearing']}."
    
    return persona


def create_chat_history_string(gameData):
    chat_history_string = ""

    if len(gameData["messages"]) >= 1:
        for message in gameData["messages"]:
            if message["type"] == "bot":
                chat_history_string += "\n"+gameData["npc"]["name"]+": "+message["message"] 
            if message["type"] == "user":
                chat_history_string += "\n"+gameData["player"]["name"]+": "+message["message"]
    
    return chat_history_string