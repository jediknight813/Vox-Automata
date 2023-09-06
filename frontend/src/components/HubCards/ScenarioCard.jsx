import React, {useState, useEffect} from 'react'
import { GetEntries, RemoveEntry } from '../../api/FormRoutes'
import { useNavigate } from 'react-router-dom'


const ScenarioCard = ( { type, username, setSelected=undefined, selectedId="", fieldName="" } ) => {
    const [Scenario, setScenario] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const ScenarioCharacterEntrys = async () => {
            var response = await GetEntries("Scenarios", username)
            response = response.sort((a, b) => b.last_modified - a.last_modified);
            setScenario(response)
        }
        ScenarioCharacterEntrys()

    }, [username])

    const DeleteEntry = async (collectionName, entryId) => {
        if (username != undefined) {
            setScenario(await RemoveEntry(collectionName, entryId, username))
            const updatedScenario = Scenario.filter(Scenario => Scenario["_id"] !== entryId);
            setScenario(updatedScenario)
        }

    }


  return (
    <div className='flex flex-col w-[95%] max-w-[1200px] rounded-lg min-h-[250px]'>

        <div className=' flex flex-col md:flex-row gap-4 items-center'>
            <h1 className=' font-Comfortaa text-3xl font-bold'>Scenarios</h1>
            {(Scenario.length >= 1 && type != "edit") &&
                <button onClick={() => navigate("/CreateScenario")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Scenario</button>
            }
            </div>

        {/* overflow container */}
        <div className={`  w-full h-auto flex overflow-x-scroll min-h-[200px] gap-5 scrollbar-thin  ${(type  == "display") ? ' scrollbar-track-website-background scrollbar-thumb-purple-900 ' : ' scrollbar-website-primary scrollbar-thumb-purple-900 '}`}>
            {Scenario.length == 0 ?
                <>
                    <div className=' flex flex-col items-center justify-center w-full gap-4'>
                        <h1 className='font-Comfortaa self-center text-center'>No Scenarios Found.</h1>
                        <button onClick={() => navigate("/CreateScenario")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Scenario</button>
                    </div>
                </>
            :
            <>
                {Scenario.map((element, index) => (
                    <div className={` min-h-[200px] min-w-[200px] rounded-md flex flex-col items-center mt-5 mb-2 ${(type  == "display") ? ' bg-website-secondary  ' : ' bg-website-secondary '}`} key={index}>
                        <h1 className=' self-center font-Comfortaa mt-10'>{element["name"]}</h1>
                        <div className=' flex gap-2 mt-auto mb-4'>

                            {(type == "display") &&
                                <>
                                    <button onClick={() => navigate("/EditScenario/:"+element["_id"])} className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700'>Edit</button>
                                    <button onClick={() => DeleteEntry("Scenarios", element["_id"])} className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800'>Delete</button>
                                </>
                            }

                            {(type == "select") &&
                                <>
                                    { (element["_id"] == selectedId(fieldName) ) ?
                                        <button className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800' onClick={() => setSelected(fieldName, "")}>unselect</button>
                                    :
                                        <button onClick={() => setSelected(fieldName, element["_id"])}>select</button>
                                    }
                                </>
                            }
                        
                        </div>
                    </div>
                ))}
            </>
            }
        </div>

    </div>
  )
}


export default ScenarioCard

