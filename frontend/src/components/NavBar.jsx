import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import defaultProfileImage from "../components/GamePage/images/DefaultProfileImage.png"


const NavBar = () => {
    const navigate = useNavigate()
    const [usernameValue, setUsername] = useState()


    useEffect(() => {
        var username = Cookies.get('username')
        setUsername(username)
    }, [])

    const UserLogOut = () => {
        Cookies.remove('username')
        window.location.reload()
    }

    return (
        <div className="navbar bg-slate-900">

            <div className="flex-1">
                <a onClick={() => navigate("/")} className="btn btn-ghost normal-case text-3xl font-sedgwick-ave-display">Vox Automata</a>
            </div>

            <div className="flex-none font-Comfortaa gap-3">

                {usernameValue == undefined &&
                    <>
                        <button onClick={() => navigate("/Login")} className=''>Login</button>
                        <button onClick={() => navigate("/Sign-Up")} className=''>Sign Up</button>
                    </>
                } 

                {usernameValue != undefined && 
                    <>
                    <h1 className=' cursor-pointer font-Comfortaa'>{usernameValue}</h1>

                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src={defaultProfileImage} />
                        </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li onClick={() => navigate("/")}><a className="justify-between">Profile</a></li>
                            <li><a>Settings</a></li>
                            <li onClick={() => UserLogOut()}><a>Logout</a></li>
                        </ul>
                    </div>
                </>
                }
                
            </div>

        </div>
    )
}

export default NavBar

