import React, { useReducer, useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { CreateEntry, GetUserEntry, updateUserEntry } from '../api/FormRoutes';
import { debounce } from 'lodash';


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


const useDebounce = (callback) => {
    const ref = useRef();
  
    useEffect(() => {
      ref.current = callback;
    }, [callback]);
  
    const debouncedCallback = useMemo(() => {
      const func = () => {
        ref.current?.();
      };
  
      return debounce(func, 1500);
    }, []);
  
    return debouncedCallback;
  };


const Form = ( {FormKeys, Type, name, fieldName} ) => {
    const [data, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate()
    const [usernameValue, setUsername] = useState()
    const { entryId } = useParams();
    const [isLoading, setIsloading] = useState(false)
    const FormLayout = FormKeys


    const UpdateFormValue = (fieldName, value) => {
        console.log(fieldName, value)
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
    

    // debouncer for text input field.
    const InputField = ( {element, index, default_value, field_name, UpdateFormValue} ) => {
        const [value, setValue] = useState(default_value)
        const textareaRef = useRef(null);

        const debouncedRequest = useDebounce(() => {
            UpdateFormValue(field_name, value)
        });


        const onChange = (e) => {
            const value = e.target.value;
            setValue(value);
            debouncedRequest();
        };

        useEffect(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }, [value]);
        

        return (
            <div key={index} className='flex flex-col w-[95%] items-start gap-4'>
                <h1 className=' capitalize'>{element["name"]}</h1>
                <textarea
                    ref={textareaRef}
                    value={value}
                    id={field_name}
                    className="resize-none p-4 input w-full scrollbar-none"
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={(e) => onChange(e)}
                />
            </div>
        )
    }

        // debouncer for dropdown input field.
        const DropdownInputField = ( {element, index, default_value, field_name, UpdateFormValue} ) => {
            const [value, setValue] = useState(default_value)
            
    
            const debouncedRequest = useDebounce(() => {
                UpdateFormValue(field_name, value)
            });
            
    
            const onChange = (e) => {
                const value = e.target.value;
                setValue(value);
                debouncedRequest();
            };
    
    
            return (
                <div key={index} className='flex flex-col w-[95%] items-start gap-4'>
                <h1 className='capitalize'>{element["name"]}:</h1>
                <select id={field_name} value={value} className='input w-full' onChange={(e) => onChange(e)}>
                    <option value="">Select an option</option>
                    {element["array_values"].map((value, subIndex) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
            )
        }


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

        setIsloading(true)

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
        setIsloading(false)
        
        navigate("/")
    }


    return (
        <div className=' w-full min-h-screen h-auto flex flex-col items-center'>
            
            {(usernameValue !== undefined) &&
                // form parent 
                <div className='flex font-Comfortaa flex-col p-5 items-center w-full max-w-[800px] gap-5 bg-website-primary h-auto min-h-[300px] mt-20 rounded-md'>
                    
                    {isLoading && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60'>
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    )}

                    <h1 className=' text-xl capitalize'>{name}</h1>
                    {FormLayout.map((element, index) => (
                        <>
                            {/* for text input */}
                            {(element["type"] == "number" || element["type"] == "string" ) &&
                                <InputField element={element} index={index} default_value={data[element["name"]]} field_name={element["name"]} UpdateFormValue={UpdateFormValue} />
                            }

                            {/* for drop down value */}
                            {(element["type"] === "array") && (
                                <DropdownInputField element={element} index={index} default_value={data[element["name"]]} field_name={element["name"]} UpdateFormValue={UpdateFormValue} />
                            )}

                            {/* for rendering components */}
                            {(element["type"] === "other") &&
                                <element.component type="select" username={usernameValue} setSelected={UpdateFormValue} selectedId={GetFormValue} fieldName={element["name"]} /> 
                            }

                        </>
                    ))}

                    <div className=' w-full flex items-center gap-4 justify-center mt-10'>
                        <button onClick={() => navigate("/Hub")} className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800'>Go Back</button>
                        <button onClick={() => submitForm()} className=' btn outline-none border-none  text-white bg-purple-800 hover:bg-purple-800'>{(Type === "Edit") && "Update"}{(Type === "Create") && "Create"}</button>
                    </div>


                </div>
            }
            
        </div>
    )
}

export default Form