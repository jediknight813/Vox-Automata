import React, { useState, useRef, useEffect } from 'react';

const SendMessage = ({ submitUserMessage }) => {
  const [userMessageValue, setUserMessageValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height to auto first
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userMessageValue]);

  const handleTextareaChange = (e) => {
    setUserMessageValue(e.target.value);
  };

  const handleSubmit = () => {
    submitUserMessage(userMessageValue);
    setUserMessageValue("");
  };

  return (
    <div className='w-full flex mt-auto flex-col'>
      <textarea
        ref={textareaRef}
        value={userMessageValue}
        className="input resize-none w-full scrollbar-none border-none pt-2" 
        onChange={handleTextareaChange}
      />
        
      <button className='btn text-white mt-2 bg-purple-700 uppercase font-Comfortaa' onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default SendMessage;


