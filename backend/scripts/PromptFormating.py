import os
from dotenv import load_dotenv
import json
load_dotenv()
from text_generation import create_npc_persona, create_chat_history_string


TEXT_GENERATION_LOCAL_URL = os.environ.get("TEXT_GENERATION_LOCAL_URL")
MODIFIER = os.environ.get("MODIFIER")

PromptFormats =  [
    "Alpaca",
    "Pygmalion-2"
]


def get_prompt_formats():
    return PromptFormats


def AlpacaFormat(gameData, userMessage):
    import guidance
    os.environ["OPENAI_API_KEY"] = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # can be anything
    os.environ["OPENAI_API_BASE"] = "http://"+TEXT_GENERATION_LOCAL_URL+"/v1"
    os.environ["OPENAI_API_HOST"] = "http://"+TEXT_GENERATION_LOCAL_URL
    guidance.llm = guidance.llms.OpenAI("text-davinci-003", caching=False)

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

    return npc_response.variables()["response"].strip()



# <|system|>Enter RP mode. Pretend to be {{char}} whose persona follows:
# {{persona}}

# You shall reply to the user while staying in character, and generate long responses.