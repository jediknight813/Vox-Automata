import HomePage from "./components/HomePage"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import LoginAndSignUp from "./components/LoginAndSignUp"
import NavBar from "./components/NavBar"
import Hub from "./components/Hub"
import Form from "./components/Form"
import NpcCharacterCard from "./components/HubCards/NpcCharacterCard"
import PlayerCharacterCard from "./components/HubCards/PlayerCharacterCard"


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


const Game_Form_Keys = [
    {"name": "name", "type": "string"},
    {"name": "senario", "type": "string"},
    {"name": "character", "type": "other", "component": NpcCharacterCard},
    {"name": "npc", "type": "other", "component": PlayerCharacterCard},
]


  return (
    <>
    {/* get fonts */}
    <link href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&display=swap" rel="stylesheet"></link>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet"></link>

    <div className='flex flex-col items-center gap-4 bg-slate-800 w-full h-auto min-h-screen text-white'>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginAndSignUp type="Login" />} />
          <Route path="/Sign-Up" element={<LoginAndSignUp type="SignUp" />} />
          <Route path="/Hub" element={<Hub />} />
          
          {/* create and edit routes for player characters */}
          <Route path="/CreatePlayerCharacter" element={<Form FormKeys={Player_Character_Form_Keys} Type="Create" name="create player character" fieldName="PlayerCharacters" />} />
          <Route path="/EditPlayerCharacter/:entryId" element={<Form FormKeys={Player_Character_Form_Keys} Type="Edit" name="edit player character" fieldName="PlayerCharacters" />} />
          
          {/* create and edit routes for npc characters */}
          <Route path="/CreateNpcCharacter" element={<Form FormKeys={NPC_Character_Form_Keys} Type="Create" name="create npc character" fieldName="NpcCharacters" />} />
          <Route path="/EditNpcCharacter/:entryId" element={<Form FormKeys={NPC_Character_Form_Keys} Type="Edit" name="edit npc character" fieldName="NpcCharacters" />} />

          {/* create and edit routes for games */}
          <Route path="/CreateGame" element={<Form FormKeys={Game_Form_Keys} Type="Create" name="create game" fieldName="Games" />} />
          <Route path="/EditGame/:entryId" element={<Form FormKeys={Game_Form_Keys} Type="Edit" name="edit game" fieldName="Games" />} />
       
        </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
