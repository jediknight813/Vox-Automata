import HomePage from "./components/HomePage"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import LoginAndSignUp from "./components/LoginAndSignUp"
import NavBar from "./components/NavBar"
import Hub from "./components/Hub"
import Form from "./components/Form"
import NpcCharacterCard from "./components/HubCards/NpcCharacterCard"
import PlayerCharacterCard from "./components/HubCards/PlayerCharacterCard"
import SenarioCard from "./components/HubCards/ScenarioCard"
import GamePage from "./components/GamePage/GamePage"
import ScenarioFormAI from "./components/AI-Form/ScenarioFormAI"


function App() {
  
    const Player_Character_Form_Keys = [
      {"name": "name", "type": "string"},
      {"name": "wearing", "type": "string"},
      {"name":"age", "type": "array", "array_values": ["young adult", "middle age", "old"]},
      {"name":"gender", "type": "array", "array_values": ["male", "female"]}
    ]

    const NPC_Character_Form_Keys = [
    {"name": "name", "type": "string"},
    {"name": "personality", "type": "string"},
    {"name": "appearance", "type": "string"},
    {"name": "wearing", "type": "string"},
    {"name":"age", "type": "array", "array_values": ["young adult", "middle age", "old"]},
    {"name":"gender", "type": "array", "array_values": ["male", "female"]}
  ]


  const Senario_Form_Keys = [
    {"name": "name", "type": "string"},
    {"name": "scenario", "type": "string"},
    {"name": "npc", "type": "other", "component": NpcCharacterCard},
    {"name": "player", "type": "other", "component": PlayerCharacterCard},
  ]


  const Game_Form_Keys = [
    {"name": "name", "type": "string"},
    {"name": "scenario", "type": "other", "component": SenarioCard},
  ]


  return (
    <>
    {/* get fonts */}
    <link href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&display=swap" rel="stylesheet"></link>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet"></link>

    <div className='flex flex-col items-center gap-4 bg-website-background w-full h-auto min-h-screen text-white'>
      <BrowserRouter>
        <NavBar />
        <Routes>


          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginAndSignUp type="Login" />} />
          <Route path="/Sign-Up" element={<LoginAndSignUp type="SignUp" />} />
          <Route path="/Hub" element={<Hub />} />
          <Route path="/ScenarioFormAI" element={<ScenarioFormAI />} />


          {/* create and edit routes for player characters */}
          <Route path="/CreatePlayerCharacter" element={<Form FormKeys={Player_Character_Form_Keys} Type="Create" name="Create Player Character" fieldName="PlayerCharacters" />} />
          <Route path="/EditPlayerCharacter/:entryId" element={<Form FormKeys={Player_Character_Form_Keys} Type="Edit" name="Edit Player Character" fieldName="PlayerCharacters" />} />


          {/* create and edit routes for npc characters */}
          <Route path="/CreateNpcCharacter" element={<Form FormKeys={NPC_Character_Form_Keys} Type="Create" name="Create Npc Character" fieldName="NpcCharacters" />} />
          <Route path="/EditNpcCharacter/:entryId" element={<Form FormKeys={NPC_Character_Form_Keys} Type="Edit" name="Edit Npc Character" fieldName="NpcCharacters" />} />


          {/* create and edit routes for senarios */}
          <Route path="/CreateScenario" element={<Form FormKeys={Senario_Form_Keys} Type="Create" name="Create Senario" fieldName="Scenarios" />} />
          <Route path="/EditScenario/:entryId" element={<Form FormKeys={Senario_Form_Keys} Type="Edit" name="Edit Senario" fieldName="Scenarios" />} />


          {/* create and edit routes for games */}
          <Route path="/CreateGame" element={<Form FormKeys={Game_Form_Keys} Type="Create" name="Create Game" fieldName="Games" />} />
          <Route path="/CurrentGame/:GameId" element={<GamePage  />} />


        </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
