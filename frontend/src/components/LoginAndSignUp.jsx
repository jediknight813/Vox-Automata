import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Login, CreateUser } from '../api/UserRoutes'
import Cookies from 'js-cookie'



const LoginAndSignUp = ( { type } ) => {
    const [username, setUsername] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate()


    const SubmitLoginInfo = async () => {
        if (username == "" || password == "") {
            return
        }
        
        const params = {
            "username": username,
            "password": password
        }


        if (type == "Login") {
            const response = await Login(params)
            console.log(response)
            if (response !== "user not found") {
                Cookies.remove('username')
                Cookies.set('username', response["username"])
            }
        }

        if (type == "SignUp") {
            const response = await CreateUser(params)
            console.log(response)
            if (response !== "user exists") {
                Cookies.remove('username')
                Cookies.set('username', response["username"])
            }
        }

        navigate("/Hub") 
    }


    return (
        <div className=' w-full h-screen flex justify-center'>
            
            <div className=' flex flex-col items-center mt-20 rounded-lg w-[95%] gap-4 bg-slate-900 h-[350px] md:w-[300px] p-5'>
                {type == "Login" ? 
                    <h1 className=' font-Comfortaa text-2xl'>Login</h1>
                    :
                    <h1 className=' font-Comfortaa text-2xl'>Create Account</h1>
                }

                <div className=' flex flex-col gap-2'>
                    <h1 className=' font-Comfortaa'>username: </h1>
                    <input onChange={(e) => setUsername(e.target.value)} value={username} type='text' placeholder=' BirdsAreReal' className=' input font-Comfortaa' />
                </div>
                
                <div className=' flex flex-col gap-2'>
                    <h1 className=' font-Comfortaa'>password: </h1>
                    <input onChange={(e) => setpassword(e.target.value)} value={password} type='password' className=' input font-Comfortaa' />
                </div>
                

                <button onClick={() => SubmitLoginInfo()} className=' btn bg-purple-700 hover:bg-purple-700 text-white font-Comfortaa cursor-pointer btn-sm transition duration-100 ease-in-out hover:-translate-y-[2px]'>
                    {type == "Login" ? 
                        <h1 className=''>Login</h1>
                        :
                        <h1>Create Account</h1>
                    }
                </button>
            </div>

        </div>
    )
}


export default LoginAndSignUp