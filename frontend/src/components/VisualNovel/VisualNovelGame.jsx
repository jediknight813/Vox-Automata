import React, { useEffect, useRef } from 'react';
import characterImage from "./CharacterOne.png"

const VisualNovelGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions and initial state
    canvas.width = 832;
    canvas.height = 512;

    // Draw a background
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a text box
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Display text in the text box
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('This is some text.', 20, canvas.height - 40);             
  }, []);

  return <canvas ref={canvasRef} />;
};

export default VisualNovelGame;
