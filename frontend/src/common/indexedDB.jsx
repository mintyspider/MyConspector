import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EditorDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('drafts', { keyPath: 'id' });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const getAllFromIndexedDB = async () => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(['drafts'], 'readonly');
            const store = transaction.objectStore('drafts');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
};

const deleteFromIndexedDB = async (key) => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(['drafts'], 'readwrite');
            const store = transaction.objectStore('drafts');
            const request = store.delete(key);

            request.onsuccess = () => {
                toast.success(`Запись ${key} удалена`);
                resolve();
            };
            request.onerror = () => {
                toast.error("Ошибка при удалении записи");
                reject(request.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
};

const IndexedDBViewer = ({ onLoad, onClose, isInitialLoad = false }) => {
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const data = await getAllFromIndexedDB();
                const sortedDrafts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setDrafts(sortedDrafts);
            } catch (error) {
                console.error("Ошибка при загрузке черновиков:", error);
                toast.error("Не удалось загрузить записи");
            }
        };
        fetchDrafts();
    }, []);

    const handleDeleteDraft = async (key) => {
        try {
            await deleteFromIndexedDB(key);
            const updatedDrafts = await getAllFromIndexedDB();
            const sortedDrafts = updatedDrafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setDrafts(sortedDrafts);
        } catch (error) {
            console.error("Ошибка при удалении черновика:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-1/2 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">
                    {isInitialLoad ? "Выберите запись для восстановления" : "Ваши сохранённые записи"}
                </h3>
                {drafts.length === 0 ? (
                    <p>Сохранённых записей не найдено</p>
                ) : (
                    <ul className="space-y-4">
                        {drafts.map(draft => (
                            <li key={draft.id} className="flex justify-between items-center p-2 border-b">
                                <div>
                                    <span className="font-medium">
                                        {draft.data?.title
                                            ? `${draft.data.title} от ${new Date(draft.timestamp).toLocaleString()}`
                                            : draft.blogId
                                              ? `Блог ${draft.blogId} от ${new Date(draft.timestamp).toLocaleString()}`
                                              : `Новый черновик от ${new Date(draft.timestamp).toLocaleString()}`}
                                    </span>
                                    <p className="text-sm text-dark-grey">
                                        Размер: {draft.data?.content ? JSON.stringify(draft.data.content).length : 0} байт
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onLoad(draft.id)}
                                        className="bg-purple/50 text-white py-1 px-2 rounded"
                                    >
                                        Восстановить
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDraft(draft.id)}
                                        className="bg-orange/50 text-white py-1 px-2 rounded"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-4 flex justify-between">
                    {isInitialLoad && (
                        <button
                            onClick={() => onClose(null)} // null для "Начать с чистого листа"
                            className="bg-purple text-white py-2 px-4 rounded"
                        >
                            Начать с чистого листа
                        </button>
                    )}
                    <button
                        onClick={() => onClose()}
                        className="bg-dark-grey/50 text-white py-2 px-4 rounded"
                    >
                        {isInitialLoad ? "Выйти" : "Отмена"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndexedDBViewer;