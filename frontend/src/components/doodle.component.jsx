import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../App';
import pencil from "../imgs/pencil.png";
import eraser from "../imgs/eraser.png";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase';
import { toast } from 'react-hot-toast';

const DoodleThing = ({ onSave, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const defaultColor = theme === "light" ? "#000000" : "#FFFFFF";
  const [color, setColor] = useState(defaultColor);
  const [size, setSize] = useState(7);
  const [isEraser, setIsEraser] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Resize canvas on window resize
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctxRef.current = ctx;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Функция для загрузки изображения в Firebase Storage
  const uploadImageToFirebase = async (imageData) => {
    const toastId = toast.loading("Загрузка изображения...");
    try {
      // Создаем уникальное имя файла
      const fileName = `doodle_${Date.now()}.png`;
      const storageRef = ref(storage, `doodles/${fileName}`);

      // Преобразуем base64 в Blob
      const blob = await fetch(imageData).then((res) => res.blob());

      // Загружаем файл в Firebase Storage
      await uploadBytes(storageRef, blob);

      // Получаем ссылку на загруженный файл
      const downloadURL = await getDownloadURL(storageRef);
      toast.success("Изображение загружено", { id: toastId });

      return downloadURL; // Возвращаем ссылку на изображение
    } catch (error) {
      toast.error("Ошибка при загрузке изображения", { id: toastId });
      console.error("Ошибка при загрузке изображения:", error);
      return null;
    }
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL(); // Получаем изображение в формате base64

    // Загружаем изображение в Firebase Storage
    const imageUrl = await uploadImageToFirebase(imageData);

    if (imageUrl) {
      // Передаем ссылку на изображение в ContentEditor
      onSave(imageUrl);
      onClose(); // Закрываем PaintPage после сохранения
    }
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

  // Функция для получения координат курсора относительно холста
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); // Получаем положение холста на странице
    const scaleX = canvas.width / rect.width;   // Масштаб по X
    const scaleY = canvas.height / rect.height; // Масштаб по Y

    return {
      x: (e.clientX - rect.left) * scaleX, // Корректируем координаты
      y: (e.clientY - rect.top) * scaleY,  // Корректируем координаты
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    setDrawing(true);

    const { x, y } = getCanvasCoordinates(e); // Получаем корректные координаты

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

    const { x, y } = getCanvasCoordinates(e); // Получаем корректные координаты

    ctx.beginPath();
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
    ctx.lineTo(x, y);
    ctx.lineWidth = size;
    ctx.lineCap = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    ctx.stroke();
    ctx.closePath();

    lastPosition.current.x = x;
    lastPosition.current.y = y;

    if (!isEraser) {
      const newLine = {
        startX: lastPosition.current.x,
        startY: lastPosition.current.y,
        endX: x,
        endY: y,
        color,
        size,
        isEraser,
      };

      setLines((prevLines) => [...prevLines, newLine]);
    }
  };

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

  const handleDowload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  return (
    <div className="bg-white text-black w-1/2 rounded-xl">
      <header className="mx-auto flex py-2 px-5 justify-center items-center">
        {/* Panel content */}
        <div>
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
              onClick={handleSave}
              className="btn p-2 border border-grey hover:bg-grey"
            >
              Save
            </button>
            <button
              onClick={handleDowload}
              className="btn p-2 border border-grey hover:bg-grey"
            >
              Download
            </button>
            <button 
              onClick={onClose}
              className="btn p-2 border border-grey hover:bg-grey"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      <div className="canvas-container center relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-black rounded-xl"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          style={{
            cursor: isEraser
              ? `url(${eraser}) 0 32, auto`
              : `url(${pencil}) 0 32, auto`
          }}
        />
      </div>
    </div>
  );
};

export default DoodleThing;