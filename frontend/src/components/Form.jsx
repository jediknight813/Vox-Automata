import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { CreateEntry, GetUserEntry, updateUserEntry } from '../api/FormRoutes';


const initialState = {};

    const reducer = (data, action) => {
        switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...data, [action.fieldName]: action.value };
        case 'UPDATE_FIELDS':
            return { ...data, ...action.fields };
        default:
            return data;
        }
    };


const Form = ( {FormKeys, Type, name, fieldName} ) => {
    const [data, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate()
    const [usernameValue, setUsername] = useState()
    const { entryId } = useParams();
        

    const handleInputChange = (event) => {
        const fieldName = event.target.id;
        const value = event.target.value;
        dispatch({ type: 'UPDATE_FIELD', fieldName, value });
    };


    const UpdateFormValue = (fieldName, value) => {
        dispatch({ type: 'UPDATE_FIELD', fieldName, value });
    }


    const GetFormValue = (keyName) => {
        if (Object.keys(data).includes(keyName)) {
            return data[keyName]
        }
        else {
            return undefined
        }
    }

    useEffect(() => {
        var username = Cookies.get('username')
        if (username == undefined) {
            navigate("/")
        }
        setUsername(username)

        if (Type === "Edit" && usernameValue != undefined) {
            const Entry = async () => {
              if (usernameValue !== undefined) {
                const entry_data = await GetUserEntry(fieldName, entryId.replace(":", ""), usernameValue);
                
                if (entry_data[0]["username"] != usernameValue) {
                    navigate("/")
                }

                if (entry_data.length >= 1) {
                  const updatedFields = {};
                  Object.keys(entry_data[0]).forEach(value => {
                    updatedFields[value] = entry_data[0][value];
                  });
                  dispatch({ type: 'UPDATE_FIELDS', fields: updatedFields });
                }
              }
            };
            Entry();
          }
    }, [usernameValue])


    const submitForm = async () => {
        var failed = false
        Object.keys(FormKeys).forEach(value => {
            if (!Object.keys(data).includes(FormKeys[value]["name"])) {
                console.log("all fields not added.")
                failed = true
            }
        })

        Object.keys(data).forEach(value => {
            if (data[value] == "") {
                console.log("all fields not filled.")
                failed = true
            }
        })
        

        if (failed == true) {
            return
        }

        if (Type == "Create") {
            data["field_name"] = fieldName
            data["username"] = usernameValue
            const response = await CreateEntry(data, fieldName)
            console.log(response)
        }

        if (Type == "Edit") {
            data["field_name"] = fieldName
            data["username"] = usernameValue
            const response = await updateUserEntry(fieldName, data["_id"], usernameValue, data)
            console.log(response)
        }
        
        navigate("/")
    }


    return (
        <div className=' w-full min-h-screen h-auto flex flex-col items-center'>
            
            {(usernameValue !== undefined) &&
                // form parent 
                <div className='flex font-Comfortaa flex-col p-5 items-center w-full max-w-[600px] gap-5 bg-slate-900 h-auto min-h-[300px] mt-20 rounded-md'>
                    <h1 className=' text-xl'>{name}</h1>
                    {FormKeys.map((element, index) => (
                        <>
                            {/* for text input */}
                            {(element["type"] == "number" || element["type"] == "string" ) &&
                                <div key={index} className='flex md:flex-row flex-col w-[90%] md:w-[60%] items-start gap-4 md:items-center'>
                                    <h1>{element["name"]}:</h1>
                                    <input type={element["type"]} id={element["name"]} value={data[element["name"]] || ''} className=' input input-sm' onChange={handleInputChange}/>
                                </div>
                            }

                            {/* for drop down value */}
                            {(element["type"] === "array") && (
                                <div key={index} className='flex md:flex-row flex-col w-[90%] md:w-[60%] items-start gap-4 md:items-center'>
                                    <h1>{element["name"]}:</h1>
                                    <select
                                        id={element["name"]}
                                        value={data[element["name"]] || ''}
                                        className='input input-sm'
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select an option</option>
                                        {element["array_values"].map((value, subIndex) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(element["type"] === "other") &&
                                <element.component type="select" username={usernameValue} setSelected={UpdateFormValue} selectedId={GetFormValue} fieldName={element["name"]} /> 
                            }


                        </>
                    ))}


                    <div className=' w-full flex items-center gap-4 justify-center mt-10'>
                        <button onClick={() => navigate("/Hub")} className=' btn text-white bg-red-800 hover:bg-red-800'>Go Back</button>
                        <button onClick={() => submitForm()} className=' btn text-white bg-purple-800 hover:bg-purple-800'>{(Type === "Edit") && "Update"}{(Type === "Create") && "Create"}</button>
                    </div>


                </div>
            }
            
        </div>
    )
}

export default Form