import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const VoiceToText = () => {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [language, setLanguage] = useState("ru-RU");
    const [history, setHistory] = useState([]);
    const [recognition, setRecognition] = useState(null);
    const [currentFileName, setCurrentFileName] = useState(`transcription_${Date.now()}.txt`);
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveButtonHighlighted, setSaveButtonHighlighted] = useState(false);  // Для анимации кнопки "Сохранить"
    
    // Загружаем историю из localStorage при монтировании компонента
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("voiceHistory")) || [];
        setHistory(savedHistory);
    }, []);

    // Сохраняем историю в localStorage
    useEffect(() => {
        localStorage.setItem("voiceHistory", JSON.stringify(history));
    }, [history]);

    // Функция для добавления записи в историю
    const addToHistory = useCallback(() => {
        setIsSaving(true);
        setTimeout(() => {
            const newFile = {
                fileName: currentFileName,
                content: text,
            };

            if (currentFileIndex !== null) {
                // Обновляем запись в истории, если файл редактируется
                const updatedHistory = [...history];
                updatedHistory[currentFileIndex] = newFile;
                setHistory(updatedHistory);
                toast.success("Текст обновлен в истории!");
            } else {
                // Добавляем новый файл в историю
                setHistory((prevHistory) => [...prevHistory, newFile]);
                toast.success("Новый файл добавлен в историю!");
            }

            setIsSaving(false);
        }, 500);
    }, [text, currentFileName, currentFileIndex]);

    // Функция для создания звукового сигнала с использованием Web Audio API
    const playAlertSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";  // Тип волны (синусоидальная)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);  // Частота (в Гц) — 440 Hz = нота Ля
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);  // Звук длится 0.5 секунд
    };

    // Обработчик начала записи
    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window)) {
            toast.error("Ваш браузер не поддерживает распознавание речи.");
            return;
        }

        const newRecognition = new window.webkitSpeechRecognition();
        newRecognition.lang = language;
        newRecognition.interimResults = true;
        newRecognition.continuous = true;

        newRecognition.onstart = () => {
            setIsRecording(true);
            playAlertSound();
            toast.success("Запись началась!");
        };

        newRecognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
            setText(transcript);
        };

        newRecognition.onerror = (event) => {
            console.log("Ошибка распознавания: ", event.error)
            setIsRecording(false);
            toast("Ошибка записи! Не забудьте сохранить текст.", { icon: '⚠️' });
            setSaveButtonHighlighted(true);  // Подсвечиваем кнопку сохранения
            playAlertSound();  // Пищалка при ошибке
        };

        newRecognition.onend = () => {
            setIsRecording(false);
            addToHistory(); // Автосохранение при завершении записи
            playAlertSound();  // Звуковой сигнал
            toast.success("Запись завершена!");
        };

        newRecognition.start();
        setRecognition(newRecognition);
    };

    // Остановка записи
    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            setRecognition(null);
            addToHistory(); // Автосохранение при остановке записи
            playAlertSound();  // Звуковой сигнал
            toast.success("Запись остановлена!");
            toast("Не забудьте сохранить текст.", { icon: '⚠️' });
            setSaveButtonHighlighted(true);  // Подсвечиваем кнопку сохранения
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

    // Создание нового файла
    const createNewFile = () => {
        setCurrentFileName(`transcription_${Date.now()}.txt`);
        setCurrentFileIndex(null);
        setText("");
        toast.success("Новый файл создан!");
    };

    // Редактирование файла
    const editFile = (index) => {
        setText(history[index].content); // Загружаем текст из выбранного файла
        setCurrentFileName(history[index].fileName); // Устанавливаем имя файла
        setCurrentFileIndex(index); // Устанавливаем индекс редактируемого файла
        toast(`Редактирование файла "${history[index].fileName}"`, { icon: 'ℹ️' });
    };

    // Удаление файла
    const deleteFile = (index) => {
        setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
        toast.success("Файл удален из истории!");
    };

    // Обработчик изменения имени файла
    const handleFileNameChange = (e, index) => {
        const newFileName = e.target.value;
        const updatedHistory = [...history];
        updatedHistory[index].fileName = newFileName;
        setHistory(updatedHistory);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-md rounded-lg w-[90%] max-h-[87vh] mx-auto">
            <div className="flex flex-row w-[80%] justify-between">
                <div className="flex flex-row gap-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                        <option value="ru-RU">Русский</option>
                        <option value="en-US">Английский</option>
                        <option value="es-ES">Испанский</option>
                        <option value="de-DE">Немецкий</option>
                    </select>

                    <button
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`px-6 py-3 text-lg font-semibold rounded-full shadow-md transition ${isRecording ? "bg-purple/40 text-white animate-pulse" : "bg-orange/40 text-white hover:bg-orange"}`}
                    >
                        {isRecording ? "Запись..." : "Начать запись"}
                    </button>

                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="px-6 py-3 text-lg font-semibold rounded-full shadow-md bg-orange/50 text-white hover:bg-red"
                        >
                            Остановить запись
                        </button>
                    )}
                </div>

                <div className="flex flex-row gap-4">
                <button
                        onClick={addToHistory}
                        disabled={!text || isSaving}
                        className={`px-6 py-3 text-lg font-semibold rounded-full shadow-md bg-red/50 text-white hover:bg-red disabled:opacity-50 disabled:cursor-not-allowed ${saveButtonHighlighted ? 'animate-pulse bg-yellow-400' : ''}`}
                    >
                        {isSaving ? <PropagateLoader color="#fff" size={8} /> : "Сохранить"}
                    </button>
                    <button
                        onClick={createNewFile}
                        className="px-6 py-3 text-lg font-semibold rounded-full shadow-md bg-purple/50 text-white hover:bg-purple"
                    >
                        Новый файл
                    </button>
                </div>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ваш текст появится здесь..."
                className="txt w-[80%] h-[90vh] p-4 text-dark0-grey border border-grey rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple"
            />

            <div className="w-full mt-4 p-2 border-t border-grey">
                <h2 className="text-md font-semibold">История:</h2>
                <ul className="list-disc pl-6">
                    {history.map((entry, index) => (
                        <li key={index}>
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    value={entry.fileName}
                                    onChange={(e) => handleFileNameChange(e, index)}
                                    className="txt px-2 py-1 border border-gray-400 rounded-lg"
                                />
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

            <p className="text-sm text-dark-grey text-center mt-2">
                Нажмите "Начать запись", чтобы конвертировать голос в текст. Вы можете редактировать текст и сохранить его.
            </p>
        </div>
    );
};

export default VoiceToText;
