import React, { useState } from 'react'


const SendMessage = ( { submitUserMessage } ) => {
  const [userMessageValue, setUserMessageValue] = useState("")

  return (
    <div className=' w-full flex h-[40px] mt-auto'>
        <input className='p-4 w-[90%] bg-website-secondary text-white rounded-tl-md rounded-bl-md font-Comfortaa outline-none border-none' onChange={(e) => setUserMessageValue(e.target.value)} value={userMessageValue} type='text' />
        <button className='w-[10%] min-w-[70px] bg-purple-700 rounded-tr-md rounded-br-md font-Comfortaa' onClick={() => { submitUserMessage(userMessageValue); setUserMessageValue("")}}>Send</button>
    </div>
  )
}


export default SendMessage

