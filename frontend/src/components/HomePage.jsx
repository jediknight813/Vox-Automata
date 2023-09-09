import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'


const HomePage = () => {
  const navigate  = useNavigate()
  

  useEffect(() => {
      var username = Cookies.get('username')
      if (username != undefined) {
        navigate("/Hub")
      }
  })


  return (
    <div className=' flex flex-col items-center w-full h-screen'>

      <div className=' flex flex-col items-center gap-2 mt-20'>
        <h1 className=' font-sedgwick-ave-display text-5xl md:text-8xl'>Vox Automata</h1>
        <h1 className=' font-Comfortaa font-extralight text-3xl'>V0.1</h1>
      </div>

      <div className=' mt-5 flex gap-5'>
        <button onClick={() => navigate("Login")} className=' btn outline-none border-none bg-website-accent text-white'>Login</button>
        <button onClick={() => navigate("Sign-Up")} className=' btn outline-none border-none bg-website-accent text-white'>Sign Up</button>
      </div>

    </div>

  )
}

export default HomePage