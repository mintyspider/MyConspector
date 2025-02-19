import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../App';
import pencil from "../imgs/pencil.png";
import eraser from "../imgs/eraser.png";

const PaintPage = () => {
  const { theme } = useContext(ThemeContext);
  const defaultColor = theme === "light" ? "#000000" : "#FFFFFF";
  const [color, setColor] = useState(defaultColor);
  const [size, setSize] = useState(7);
  const [isEraser, setIsEraser] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Resize canvas on window resize
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - 80;
    ctxRef.current = ctx;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const onSave = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const setActiveColor = () => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    setActiveColor();
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (isNaN(newSize) || newSize <= 0) return;
    setSize(newSize);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    setDrawing(true);

    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left; // X-coordinate relative to the canvas
    const y = e.clientY - canvasRect.top;  // Y-coordinate relative to the canvas

    lastPosition.current.x = x;
    lastPosition.current.y = y;
  };

  const stopDrawing = () => {
    setDrawing(false);
    saveToUndoStack();
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    // Start a new path for the drawing
    ctx.beginPath();
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y); // Move to the previous position
    ctx.lineTo(x, y);  // Draw to the current position
    ctx.lineWidth = size;
    ctx.lineCap = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'; // Eraser mode
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    } else {
      ctx.globalCompositeOperation = 'source-over'; // Drawing mode
      ctx.strokeStyle = color;
    }
    
    ctx.stroke();
    ctx.closePath();

    // Update the last position to the current one
    lastPosition.current.x = x;
    lastPosition.current.y = y;

    const newLine = {
      startX: lastPosition.current.x,
      startY: lastPosition.current.y,
      endX: x,
      endY: y,
      color,
      size,
      isEraser,
    };

    if (!isEraser) {
      setLines((prevLines) => [...prevLines, newLine]);
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoStack([]);
    setRedoStack([]);
    setLines([]);
  };

  const undo = () => {
    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];
    setRedoStack([lastLine, ...redoStack]);

    setLines((prevLines) => prevLines.slice(0, prevLines.length - 1));

    saveToUndoStack();
    redrawCanvas();
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[0];
    setLines((prevLines) => [...prevLines, lastRedo]);

    setRedoStack((prevStack) => prevStack.slice(1));

    saveToUndoStack();
    redrawCanvas();
  };

  const saveToUndoStack = () => {
    const currentState = [...lines];
    setUndoStack((prevStack) => [...prevStack, currentState]);
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.lineWidth = line.size;
      ctx.strokeStyle = line.color;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
    });
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="bg-white text-black">
      <header className="w-11/12 mx-auto flex py-2 px-5 justify-center items-center">
        <button
          onClick={togglePanel}
          className="text-2xl p-2"
          style={{
            position: 'absolute',
            top: '85px',
            left: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          {isPanelVisible ? '↑' : '↓'}
        </button>

        {/* Panel content */}
        <div
          style={{
            transition: 'transform 0.3s ease',
            transform: isPanelVisible ? 'translateY(0)' : 'translateY(-150%)',
          }}
        >
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={toggleEraser}
              className="btn p-2 border border-grey hover:bg-grey"
            >
              {isEraser ? 'Marker' : 'Eraser'}
            </button>
            <button onClick={undo} className="btn p-2 border border-grey hover:bg-grey">
              Undo
            </button>
            <button onClick={redo} className="btn p-2 border border-grey hover:bg-grey">
              Redo
            </button>
            <button onClick={clearCanvas} className="btn p-2 border border-grey hover:bg-grey">
              Clear
            </button>

            {/* Custom color picker with text and square */}
            <div className="flex items-center">
              <span className="mr-2">Color:</span>
              <button
                onClick={() => document.getElementById('color-picker').click()}
                style={{
                  backgroundColor: color,
                  width: '30px',
                  height: '30px',
                  border: '2px solid #ccc',
                  borderRadius: '5px',
                }}
                className="mr-2"
              />
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                id="color-picker"
                style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
              />
            </div>

            {/* Size selection */}
            <div className="size-btn p-1 border border-grey">
              <label className="mr-2">Size:</label>
              <button onClick={() => setSize(size + 1)} className="px-2 py-1 text-xl">+</button>
              <button onClick={() => setSize(size - 1)} className="px-2 py-1 text-xl">-</button>
              <input type="number" value={size} onChange={handleSizeChange} className="border p-1 w-16 size" min="1" max="20" />
            </div>

            {/* Save button */}
            <button
              onClick={onSave}
              className="btn p-2 border border-grey hover:bg-grey"
            >
              Save
            </button>
          </div>
        </div>
      </header>

      <div className="canvas-container h-[calc(100vh-150px)] relative">
        <canvas
          ref={canvasRef}
          className="w-11/12 h-full center border border-black rounded-xl"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          style={{
            cursor: isEraser
              ? `url(${eraser}) 0 64, auto` // Eraser cursor
              : `url(${pencil}) 0 64, auto`  // Pencil cursor
          }}          
        />
      </div>
    </div>
  );
};

export default PaintPage;
