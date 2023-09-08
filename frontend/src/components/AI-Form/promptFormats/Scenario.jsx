


export const FormatPromptForScenario = (PlayerData, NpcData) => {
    return {"character_one_details": `${PlayerData["name"]}'s is ${PlayerData["gender"]}`, "character_two_details": `${NpcData["name"]} is a ${NpcData["gender"]}, ${NpcData["name"]}'s build is ${NpcData["appearance"]} ${NpcData["name"]}'s personality is ${NpcData["personality"]}`}
}