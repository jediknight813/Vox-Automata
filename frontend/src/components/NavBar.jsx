import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import defaultProfileImage from "./ChatPage/images/DefaultProfileImage.png"
import { GetModels, UnloadModels, LoadModel, DownloadModel } from '../api/ModelRoutes'


const NavBar = () => {
    const navigate = useNavigate()
    const [usernameValue, setUsername] = useState()
    const [models, setModels] = useState([])
    const [selectedModel, setSelectedModel] = useState()
    const [modelFormData, setModelFormData] = useState({
        author_name: '',
        author_repo: '',
        author_model: '',
    });
    const [gpuLayers, setGpuLayers] = useState(0)
    const [modelCtx, setModelCtx] = useState(4096)
    const PromptFormats = ["Alpaca", "DolphinMixtralFormat", "Pygmalion2Format", "MagpieFormat", "NpcThinking"]
    const [currentPromptFormat, setPromptFormat] = useState()


    useEffect(() => {
        const username = Cookies.get('username')
        setUsername(username)

        const getNpcImage = async () => {
            var models_response = await GetModels()
            if (models_response !== undefined) {
                setModels(models_response)
                setSelectedModel(models_response[0])
            }
        }
        getNpcImage()

        const PromptFormat = Cookies.get('PromptFormat')
        if (PromptFormat == undefined) {
            Cookies.set("PromptFormat", PromptFormats[0])
            setPromptFormat(PromptFormat[0])
        }
        else{
            setPromptFormat(PromptFormat)
        }

    }, [])

    const UserLogOut = () => {
        Cookies.remove('username')
        window.location.reload()
    }

    const updatePromptFormat = (format) => {
        Cookies.set("PromptFormat", format)
        setPromptFormat(format)
    }
    

    return (
    <>

        <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">

        <form method="dialog" className="modal-box bg-website-background">
            <h3 className="font-bold text-lg">Settings Menu</h3>

            <div className=' mt-2 flex flex-col gap-4'>
                <h1>Model Selection</h1>
                <select className=' input' value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <option value="">Select a model</option>
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>

                <div className=' flex flex-col gap-3'>
                    <h1>Gpu Layers</h1>
                    <input className=' input' placeholder="35" value={gpuLayers} onChange={(e) => setGpuLayers(e.target.value)} />
                </div>

                <div className=' flex flex-col gap-3'>
                    <h1>model context window</h1>
                    <input className=' input' placeholder="35" value={modelCtx} onChange={(e) => setModelCtx(e.target.value)} />
                </div>

                <div className=' flex gap-3 items-center'>
                    <button onClick={() => UnloadModels()} className=' btn bg-red-800 text-white hover:bg-red-800'>Unload Model</button>
                    <button onClick={() => LoadModel(selectedModel, gpuLayers, modelCtx)} className=' btn text-white bg-website-accent hover:bg-website-accent'>Load Model</button>
                </div>
            </div>

            <div className=' mt-2 flex flex-col gap-4'>
                <h1>Prompt Format</h1>
                <select className=' input' value={currentPromptFormat} onChange={(e) => updatePromptFormat(e.target.value)}>
                    <option value="">Select a prompt format.</option>
                    {PromptFormats.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className=' flex flex-col gap-3'>

                <h1 className=' mt-5'>Download Model</h1>
                <input className=' input' placeholder="Author Name" onChange={(e) => setModelFormData({ ...modelFormData, author_name: e.target.value })} />
                <input className=' input' placeholder="Author Repository" onChange={(e) => setModelFormData({ ...modelFormData, author_repo: e.target.value })} />
                <input className=' input' placeholder="Author Model" onChange={(e) => setModelFormData({ ...modelFormData, author_model: e.target.value })}/>
                
                <button onClick={() => DownloadModel(modelFormData)} className='btn outline-none border-none text-white bg-website-accent hover:bg-website-accent'>Start Download</button>
            </div>

            <div className="modal-action flex-none w-full items-center justify-center">
                <button className="btn outline-none border-none pr-10 pl-10 text-white bg-website-accent hover:bg-website-accent">Close</button>
            </div>

        </form>
        </dialog>


        <div className="navbar bg-website-primary z-20">

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
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-website-primary rounded-box w-52">
                            <li onClick={() => navigate("/")}><a className="justify-between">Profile</a></li>
                            <li><a onClick={()=>window.my_modal_1.showModal()}>Settings</a></li>
                            <li onClick={() => navigate("CharacterFormAI")}><a>Generate Character</a></li>
                            <li onClick={() => navigate("ScenarioFormAI")}><a>Generate Scenario</a></li>
                            <li onClick={() => UserLogOut()}><a>Logout</a></li>
                        </ul>
                    </div>
                </>
                }
                
            </div>

        </div>

        </>
    )
}

export default NavBar

