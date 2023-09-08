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
                            

GptCharacterGenerationPrompt = guidance('''
{{#system~}}
You are a character generator, given a user prompt you will help them design that character, do not respond with anything else, keep it short and to the point.
{{~/system}}

{{#user~}}
I want to make a character that is {{user_prompt}}.
What would the name of this character be?
Only respond with the first and last name.
{{~/user}}

{{#assistant~}}
{{gen 'character_name' max_tokens=50}}
{{~/assistant}}

{{#user~}}
What would the personality of this character be?
Only respond with the personality, this should be detailed.
{{~/user}}

{{#assistant~}}
{{gen 'character_personality' max_tokens=100}}
{{~/assistant}}
                                        

{{#user~}}
What would the appearance of this character be?
Only respond with the appearance.
{{~/user}}

{{#assistant~}}
{{gen 'character_appearance' max_tokens=100}}
{{~/assistant}}


{{#user~}}
What would this character be wearing?
Only respond with the clothing.
{{~/user}}

{{#assistant~}}
{{gen 'character_clothing' max_tokens=100}}
{{~/assistant}}                            
''')



LocalCharacterGeneration = guidance('''
### Instruction:
You are a character generator, given a user prompt you will help them design that character, do not respond with anything else, keep it short and to the point.
                                    
USER: {{character_prompt}}

### Response:                           
First Name: {{~gen 'character_first_name' temperature=0.8 stop='\n' }}
Last Name: {{~gen 'character_last_name' temperature=0.8 stop='\n' }}
Personality: {{~gen 'character_personality' temperature=0.8 stop='\n' }}
Character Characteristics: {{~gen 'character_appearance' temperature=0.8 stop='\n' }}                            
Currently Wearing: {{~gen 'character_clothing' temperature=0.8 stop='\n' }}  
''')

# <|system|>Enter RP mode. Pretend to be {{char}} whose persona follows:
# {{persona}}

# You shall reply to the user while staying in character, and generate long responses.