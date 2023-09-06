import guidance


PromptFormats =  [
    "Alpaca",
    "Pygmalion2Format"
]



AlpacaFormat = guidance('''
    ### Instruction:
    {{npc_name}}'s Persona: {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.

    Scenario: {{scenario}}.
    {{modifier}}

    {{history}}
    {{player_name}}: {{question}}

    ### Response:
    {{npc_name}}: {{~gen 'response' temperature=0.8 stop='\n' }}
''')


Pygmalion2Format = guidance('''
   <|system|> Enter RP mode. Pretend to be {{npc_name}} whose persona follows:
   {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.

    you shall reply to the user while staying in character, and generate long responses.
    Scenario: {{scenario}}.
                            

    {{history}}
    <|user|> {{player_name}}: {{question}}

    <|model|> {{npc_name}}: {{~gen 'response' temperature=0.8 stop='\n' }}
''')


ScenarioLocation = guidance('''
    ### Instruction:
    Your job in is extract the describe location details from a given scenario, only return the details of this location, don't include people, don't explain yourself.

    Scenario: {{scenario}}.
    ### Response:
    The background has {{~gen 'response' temperature=0.8 stop='\n' max_tokens=100 }}
''')

# <|system|>Enter RP mode. Pretend to be {{char}} whose persona follows:
# {{persona}}

# You shall reply to the user while staying in character, and generate long responses.