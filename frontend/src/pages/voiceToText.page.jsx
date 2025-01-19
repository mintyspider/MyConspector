import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast'; // Импортируем toast

const VoiceToText = () => {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [language, setLanguage] = useState("ru-RU");
    const [history, setHistory] = useState([]);
    const [recognition, setRecognition] = useState(null);
    const timestamp = new Date().toISOString().replace(/[^\w\s]/gi, '_'); // Преобразуем дату в строку и заменяем неалфавитные символы
    const [currentFileName, setCurrentFileName] = useState(`transcription_${timestamp}.txt`);
    const [currentFileIndex, setCurrentFileIndex] = useState(null);

    // Загружаем историю из localStorage при монтировании компонента
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("voiceHistory")) || [];
        setHistory(savedHistory);
    }, []);

    // Сохранение истории в localStorage
    useEffect(() => {
        localStorage.setItem("voiceHistory", JSON.stringify(history));
    }, [history]);

    // Запуск записи
    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window)) {
            toast.error("Ваш браузер не поддерживает распознавание речи.");
            return;
        }

        const newRecognition = new window.webkitSpeechRecognition();
        newRecognition.lang = language;
        newRecognition.interimResults = true;
        newRecognition.continuous = true; // Запись продолжается, даже если пауза

        newRecognition.onstart = () => {
            setIsRecording(true);
            toast.success("Запись началась!");
        };
        newRecognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
            setText(transcript);
        };

        newRecognition.onerror = (event) => {
            toast.error(`Ошибка распознавания`);
            console.log("Ошибка распознавания: ", event.eror)
            setIsRecording(true);
        };

        newRecognition.onend = () => {
            setIsRecording(false);
            toast.info("Запись завершена!");
        };

        newRecognition.start();
        setRecognition(newRecognition); // Сохраняем объект для дальнейшего использования
    };

    // Остановка записи
    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            setRecognition(null);
        }
    };

    // Добавление текста в историю
    const addToHistory = () => {
        if (currentFileIndex !== null) {
            // Если файл уже существует, обновляем его содержимое
            setHistory((prevHistory) => {
                const updatedHistory = [...prevHistory];
                updatedHistory[currentFileIndex] = {
                    fileName: currentFileName,
                    content: text,
                };
                return updatedHistory;
            });
            toast.success("Текст добавлен в историю!");
        } else {
            // Если файл новый, добавляем его в историю
            setHistory((prevHistory) => [
                ...prevHistory,
                { fileName: currentFileName, content: text },
            ]);
            toast.success("Новый файл добавлен в историю!");
        }
    };

    // Сохранение текста в файл
    const saveTextToFile = (content, fileName) => {
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        toast.success(`Файл "${fileName}" сохранен!`);
    };

    // Создание нового файла (с новым именем)
    const createNewFile = () => {
        setCurrentFileName(`transcription_${Date.now()}.txt`); // Генерация уникального имени
        setCurrentFileIndex(null); // Новый файл, сбрасываем индекс
        setText(""); // Очищаем текст
        toast.success("Новый файл создан!");
    };

    // Вывод и редактирование текста из истории
    const editFile = (index) => {
        setText(history[index].content); // Загружаем содержимое файла для редактирования
        setCurrentFileName(history[index].fileName);
        setCurrentFileIndex(index); // Устанавливаем индекс редактируемого файла
        toast.info(`Редактирование файла "${history[index].fileName}"`);
    };

    // Удаление файла из истории
    const deleteFile = (index) => {
        setHistory((prevHistory) => {
            const updatedHistory = prevHistory.filter((_, i) => i !== index);
            return updatedHistory;
        });
        toast.success("Файл удален из истории!");
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-md rounded-lg w-[90%] max-h-[87vh] mx-auto">
            <div className="flex flex-row gap-4">
                {/* Выбор языка */}
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="lang p-2 mt-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                >
                    <option value="ru-RU">Русский</option>
                    <option value="en-US">Английский</option>
                    <option value="es-ES">Испанский</option>
                    <option value="de-DE">Немецкий</option>
                </select>

                {/* Кнопка записи */}
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`px-6 py-3 mt-4 text-lg font-semibold rounded-full shadow-md transition 
            ${isRecording
                            ? "bg-purple/40 text-white animate-pulse"
                            : "bg-orange/40 text-white hover:bg-orange"
                        }`}
                >
                    {isRecording ? "Запись..." : "Начать запись"}
                </button>

                {/* Кнопка остановки записи */}
                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="px-6 py-3 mt-4 text-lg font-semibold rounded-full shadow-md bg-orange/50 text-white hover:bg-red"
                    >
                        Остановить запись
                    </button>
                )}

                {/* Кнопка для добавления текста в историю */}
                <button
                    onClick={addToHistory}
                    disabled={!text}
                    className="px-6 py-3 mt-4 text-lg font-semibold rounded-full shadow-md bg-red/50 text-white hover:bg-red"
                >
                    Сохранить
                </button>

                {/* Кнопка для создания нового файла */}
                <button
                    onClick={createNewFile}
                    className="px-6 py-3 mt-4 text-lg font-semibold rounded-full shadow-md bg-purple/50 text-white hover:bg-purple"
                >
                    Новый файл
                </button>
            </div>

            {/* Поле для отображения текста */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)} // Возможность редактировать текст
                placeholder="Ваш текст появится здесь..."
                className="txt w-[80%] h-[90vh] p-4 text-dark0-grey border border-grey rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple"
            />

            {/* История */}
            <div className="w-full mt-4 p-2 border-t border-grey">
                <h2 className="text-md font-semibold">История:</h2>
                <ul className="list-disc pl-6">
                    {history.map((entry, index) => (
                        <li key={index}>
                            <div className="flex justify-between items-center">
                                <span>{entry.fileName}</span>
                                <button
                                    onClick={() => saveTextToFile(entry.content, entry.fileName)}
                                    className="ml-4 text-blue-500"
                                >
                                    Скачать
                                </button>
                                <button
                                    onClick={() => editFile(index)}
                                    className="ml-4 text-green-500"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => deleteFile(index)}
                                    className="ml-4 text-red-500"
                                >
                                    Удалить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Инструкция */}
            <p className="text-sm text-dark-grey text-center mt-2">
                Нажмите "Начать запись", чтобы конвертировать голос в текст. Вы можете редактировать текст и сохранить его.
            </p>
        </div>
    );
};

export default VoiceToText;
