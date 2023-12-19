import guidance


PromptFormats = ["Alpaca", "Pygmalion2Format"]


AlpacaFormat = guidance(
    """
    ### Instruction:
    {{npc_name}}'s Persona: {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.

    Scenario: {{scenario}}.
    {{modifier}}

    {{history}}
    {{player_name}}: {{question}}

    ### Response:
    {{npc_name}}: {{~gen "response" temperature=0.8 stop='\n' }}
"""
)


DolphinMixtralFormat = guidance(
    """
<|im_start|>system
{{npc_name}}'s Persona: {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.
{{player_name}} is {{player_details}}.

Story Scenario: {{scenario}}.

{{history}}<|im_end|>
<|im_start|>user
{{player_name}}: {{question}}<|im_end|>

<|im_start|>assistant
{{npc_name}}: {{~gen "response" temperature=0.8 stop='<|im_end|>' }}
"""
)


NpcThinking = guidance(
    """
    You are {{npc_name}}, write all responses in character as {{npc_name}}, you will respond with what you are thinking about first, then you will respond with what you want to say in character as {{npc_name}}.
    Respond to everything in first person, be descriptive with your responses. 
    ### Instruction:
    {{npc_name}}'s Persona: {{npc_persona}}.

    Scenario: {{scenario}}.

    {{history}}
    {{player_name}}: {{question}}

    ### Response:
    What is {{npc_name}} thinking about right now: {{~gen "thoughts" temperature=0.8 stop='\n' }}      
    What does {{npc_name}} say to {{player_name}}: {{~gen "response" temperature=0.8 stop='\n' }}
"""
)


MagpieFormat = guidance(
    """
    Write an engaging response from {{npc_name}} to {{player_name}} in a descriptive writing style. Express {{npc_name}}'s actions and sensory perceptions in vivid detail. Proactively advance the conversation with narrative prose as {{npc_name}}. Use informal language when composing dialogue, taking into account {{npc_name}}'s personality and communication style.

    ### Instruction:
    {{npc_name}}'s Persona: {{npc_persona}}.

    Scenario: {{scenario}}.

    {{history}}
    {{player_name}}: {{question}}

    ### Response:
    {{npc_name}}: {{~gen "response" temperature=0.8 stop='\n' }}
"""
)


Pygmalion2Format = guidance(
    """
   <|system|> Enter RP mode. Pretend to be {{npc_name}} whose persona follows:
   {{npc_persona}}, {{npc_name}} is currently with {{player_name}}.

    you shall reply to the user while staying in character, and generate long responses.
    Scenario: {{scenario}}.
                            

    {{history}}
    <|user|> {{player_name}}: {{question}}

    <|model|> {{npc_name}}: {{~gen "response" temperature=0.8 stop='\n' }}
"""
)


ScenarioLocation = guidance(
    """
    ### Instruction:
    Your job in is extract the describe location details from a given scenario, only return the details of this location, don't include people, don't explain yourself.

    Scenario: {{scenario}}.
    ### Response:
    The background has {{~gen 'response' temperature=0.8 stop='\n' max_tokens=100 }}
"""
)


GptCharacterGenerationPrompt = guidance(
    """
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
Only respond with the personality, this should be very detailed, keep it clear and concise though.
{{~/user}}

{{#assistant~}}
{{gen 'character_personality' max_tokens=150}}
{{~/assistant}}
                     

{{#user~}}
What would the appearance of this character be? don't include clothing in the description. 
Only respond with the appearance, this should be very detailed, clear and concise though.
{{~/user}}

{{#assistant~}}
{{gen 'character_appearance' max_tokens=150}}
{{~/assistant}}


{{#user~}}
What would this character be wearing?
Only respond with the clothing, keep it short.
{{~/user}}

{{#assistant~}}
{{gen 'character_clothing' max_tokens=100}}
{{~/assistant}}                            
"""
)


GptScenarioGenerationPrompt = guidance(
    """
{{#system~}}
You are a scenario generator, given two characters and a scenario idea, do not respond with anything or explain yourself, keep it short and to the point.
{{~/system}}

{{#user~}}
Character One: {{character_one_name}}
{{character_one_description}}.
                                       
Character Two: {{character_two_name}}
{{character_two_description}}.                           

Scenario Idea: {{scenario_prompt}}

What would the plot between these two characters be based on the scenario idea? 
Only respond with a simple plot, don't include backstory.
{{~/user}}

{{#assistant~}}
{{gen 'plot'}}
{{~/assistant}}

{{#user~}}
What should the backstory between these two characters be?
Only respond with the backstory.
{{~/user}}

{{#assistant~}}
{{gen 'backstory'}}
{{~/assistant}}

{{#user~}}
What should the intro situation be to this scenario.
Only respond with the intro situation.
{{~/user}}

{{#assistant~}}
{{gen 'situation'}}
{{~/assistant}}
"""
)


LocalCharacterGeneration = guidance(
    """
### Instruction:
You are a character generator, given a user prompt you will help them design that character, do not respond with anything else, keep it short and to the point.
                                    
USER: {{character_prompt}}

### Response:                           
First Name: {{~gen 'character_first_name' temperature=0.8 stop='\n' }}
Last Name: {{~gen 'character_last_name' temperature=0.8 stop='\n' }}
Personality: {{~gen 'character_personality' temperature=0.8 stop='\n' }}
Character Characteristics: {{~gen 'character_appearance' temperature=0.8 stop='\n' }}                            
Currently Wearing: {{~gen 'character_clothing' temperature=0.8 stop='\n' }}  
"""
)

LocalCharacterGenerationV2 = guidance(
    """
### Instruction:
You are a character generator, given a user prompt you will help them design that character, do not respond with anything else, keep it short and to the point.
                                    
Character Prompt: {{character_prompt}}

### Response:
What should the characters first and last name be?         
Only respond with the name, no quotes and nothing else.                  
Character Name: {{~gen 'character_name' temperature=0.8 stop='\n' }}
                                      
Only respond with the characters mbti type that best matches the character prompt.                                 
Characters MBTI type: {{~gen 'character_mbti' temperature=0.8 stop='\n' }}
                                      
The characters personality should be very detailed, only include details about this characters behavioral characteristics, flaws and weaknesses, personality traits, quirks and habits, do not include clothing or items.
Personality: {{~gen 'character_personality' temperature=0.8 stop='\n' }}
                                      
For Physical Characteristics Do not respond with Clothing or Armor in the Physical Characteristics.
Physical Characteristics (no armor or clothing): has {{~gen 'character_appearance' temperature=0.8 stop='\n' }}
                                      
For what character is wearing, Only include clothing items, keep it short and to the point.                            
Currently Wearing: {{~gen 'character_clothing' temperature=0.8 stop='\n' }}
"""
)


LocalSenarioGeneration = guidance(
    """
### Instruction:
You are a scenario generator, given two characters and a scenario idea, be creative, do not respond with anything or explain yourself.

USER: 
Character One: {{character_one_name}}
{{character_one_description}}.
                                       
Character Two: {{character_two_name}}
{{character_two_description}}.           

Scenario Idea: {{scenario_prompt}}

What would the plot between these two characters be based on the scenario idea? 
Only respond with a simple plot, don't include backstory.
                                  
### Response:                           
Plot: {{~gen 'plot' temperature=0.8 stop='\n' }}

USER:
What should the backstory between these two characters be? 
Only respond with the backstory of these two characters, don't include any plot details.
                                 
### Response:
Backstory: {{~gen 'backstory' temperature=0.8 stop='\n' }}

USER: 
What should the intro situation be to this scenario. Only respond with the intro situation.
This should be short and to the point.
### Response:  
Intro Situation: {{~gen 'situation' temperature=0.8 stop='\n' }}
"""
)


LocalSenarioGenerationV2 = guidance(
    """
### Instruction:
You are a scenario generator, given two characters and a scenario idea, generate a scenario, be creative, do not respond with anything or explain yourself.

Character One Name: {{character_one_name}}
Character One Description: {{character_one_description}}.
                                       
Character Two Name: {{character_two_name}}
Character Two Description: {{character_two_description}}.           

Scenario Prompt: {{scenario_prompt}}

For the scenario introduction include details about the starting situation the character find themselves in based on the scenario prompt.
Do not include details that are not relevant to the introduction.                                  
Scenario Introduction: {{~gen 'situation_intro' temperature=0.8 stop='\n' }}
                                    
For the scenario setting only include details about the location.
Scenario Setting: {{~gen 'situation_location' temperature=0.8 stop='\n' }}

Explain the starting scene with both characters.
Both characters need to be at the same location.
Starting Scene: {{~gen 'situation_scene' temperature=0.8 stop='\n' }}                                  
"""
)
