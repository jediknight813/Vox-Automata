import HomePage from "./components/HomePage"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import LoginAndSignUp from "./components/LoginAndSignUp"
import NavBar from "./components/NavBar"
import Hub from "./components/Hub"
import Form from "./components/Form"


function App() {
 
  const Player_Character_Form_Keys = [
      {"name": "name", "type": "number"},
      {"name": "background", "type": "number"},
      { "name":"age", "type": "string"}
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
          <Route path="/CreatePlayerCharacter" element={<Form FormKeys={Player_Character_Form_Keys} Type="Create" name="create player character" fieldName="PlayerCharacters" />} />
          <Route path="/EditPlayerCharacter/:entryId" element={<Form FormKeys={Player_Character_Form_Keys} Type="Edit" name="edit player character" fieldName="PlayerCharacters" />} />
        </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
