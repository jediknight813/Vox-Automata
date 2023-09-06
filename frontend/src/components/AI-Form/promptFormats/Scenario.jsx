


export const FormatPromptForScenario = (PlayerData, NpcData, Prompt) => {
    var PromptList = []
    var systemPrompt = "You are a scenario generator, given two characters and a topic generate a scenario, do not respond with anything or explain yourself."
    PromptList.push({"role": "user", "content": systemPrompt})

    var userPrompt = `Character One: ${NpcData["name"]}\n${NpcData["name"]} is a ${NpcData["gender"]}, and is wearing ${NpcData["wearing"]}, ${NpcData["name"]}'s build is ${NpcData["appearance"]} ${NpcData["name"]}'s personality is ${NpcData["personality"]}.\n
Character Two: ${PlayerData["name"]}\n${PlayerData["name"]}'s is ${PlayerData["gender"]}, and is wearing ${NpcData["wearing"]}. \n
    
Scenario Prompt: ${Prompt}
    `

    PromptList.push({"role": "system", "content": userPrompt})

    return PromptList
}