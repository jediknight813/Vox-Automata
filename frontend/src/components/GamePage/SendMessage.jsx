import React, { useState, useEffect, useRef } from 'react'


const SendMessage = ( { submitUserMessage } ) => {
  const [userMessageValue, setUserMessageValue] = useState("")
  const textareaRef = useRef(null);


  useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [userMessageValue]);
  

  return (
    <div className=' w-full flex mt-auto flex-col'>
        <textarea
              ref={textareaRef}
              value={userMessageValue}
              className=" input resize-none p-4 w-full scrollbar-none border-none"
              onChange={(e) => setUserMessageValue(e.target.value)}
          />
        
        <button className='btn text-white mt-2 bg-purple-700 uppercase font-Comfortaa' onClick={() => { submitUserMessage(userMessageValue); setUserMessageValue("")}}>Send</button>
    </div>
  )
}


export default SendMessage

