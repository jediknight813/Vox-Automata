import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'


const NavBar = () => {
    const navigate = useNavigate()
    const [usernameValue, setUsername] = useState()


    useEffect(() => {
        var username = Cookies.get('username')
        setUsername(username)
    }, [])

    const ResetCookies = () => {
        Cookies.remove('username')
    }

    return (
        <div className="navbar bg-slate-900">

            <div className="flex-1">
                <a onClick={() => navigate("/")} className="btn btn-ghost normal-case text-3xl font-sedgwick-ave-display">Vox Automata</a>
            </div>

            <div className="flex-none font-Comfortaa gap-3">

                <button onClick={() => ResetCookies()}>Reset Cookies</button>
                {usernameValue == undefined &&
                    <>
                        <button onClick={() => navigate("/Login")} className=''>Login</button>
                        <button onClick={() => navigate("/Sign-Up")} className=''>Sign Up</button>
                    </>
                }    
                {usernameValue != undefined && 
                    <h1 className=' cursor-pointer'>{usernameValue}</h1>
                }
                
            </div>

        </div>
    )
}

export default NavBar

