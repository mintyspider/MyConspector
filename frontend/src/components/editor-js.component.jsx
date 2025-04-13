import React, { useEffect, useRef, useContext, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Checklist from '@editorjs/checklist';
import Warning from '@editorjs/warning';
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import NestedList from '@editorjs/nested-list';
import EJLaTeX from 'editorjs-latex';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase';
import { EditorContext } from '../pages/editor.pages';
import ImageTool from '@editorjs/image';
import { ThemeContext } from '../App';
import DoodleThing from './doodle.component';
import IndexedDBViewer from '../common/indexedDB';
import Toolbar from './toolbar.component';
import { v4 as uuidv4 } from 'uuid';
import { blogStructure } from '../pages/blog.page';
// Функции для работы с IndexedDB
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

const saveToIndexedDB = async (data, key, blogId) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(['drafts'], 'readwrite');
        const store = transaction.objectStore('drafts');
        const draft = {
            id: key,
            blogId: blogId,
            data: data,
            timestamp: new Date().toISOString(),
        };
        store.put(draft);
        transaction.oncomplete = () => {
            console.log(`Данные сохранены в IndexedDB с ключом ${key}`, draft);
        };
    } catch (error) {
        console.error("Ошибка при сохранении в IndexedDB:", error);
    }
};

const loadFromIndexedDB = async (key) => {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(['drafts'], 'readonly');
            const store = transaction.objectStore('drafts');
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result ? request.result.data : null;
                console.log(`Загружен блог из IndexedDB с ключом ${key}:`, result);
                resolve(result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
};

const ContentEditor = ({ onClose, value }) => {
    const { blog, setBlog } = useContext(EditorContext);
    const { theme } = useContext(ThemeContext);
    const currentTheme = theme;
    const editorRef = useRef(null);
    const [isPaintOpen, setIsPaintOpen] = useState(false);
    const [showIndexedDBViewer, setShowIndexedDBViewer] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showInitialDraftModal, setShowInitialDraftModal] = useState(false);

    // Кастомный инструмент для DoodleThing
    const DoodleTool = {
        class: class {
            static get toolbox() {
                return {
                    title: 'Рисунок',
                    icon: '<i class="fi fi-rr-pencil"></i>',
                };
            }

            render() {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = '<p>Нажмите, чтобы открыть редактор рисунков</p>';
                wrapper.style.cursor = 'pointer';
                wrapper.addEventListener('click', () => {
                    setIsPaintOpen(true);
                });
                return wrapper;
            }

            save(blockContent) {
                return {
                    url: this.data?.url || '',
                };
            }

            renderSettings() {
                return {};
            }
        },
    };

    const uploadImageByFile = async (file) => {
        const storageRef = ref(storage, `files/${file.name}`);
        const toastId = toast.loading("Загрузка...");

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            toast.success("Загрузка завершена", { id: toastId });
            return { success: 1, file: { url: downloadURL } };
        } catch (error) {
            toast.error("Ошибка при загрузке файла", { id: toastId });
            console.error("Ошибка при загрузке файла:", error);
            return { success: 0, file: { url: null } };
        }
    };

    const handleSaveImage = (imageUrl) => {
        setIsPaintOpen(false);
        if (editorRef.current && editorRef.current.blocks) {
            const imageBlock = {
                type: 'image',
                data: {
                    file: { url: imageUrl },
                    caption: '',
                    stretched: false,
                    withBackground: false,
                    withBorder: false,
                },
            };
            editorRef.current.blocks.insert('image', imageBlock.data);
        } else {
            console.error("Редактор ещё не инициализирован для добавления изображения");
            toast.error("Не удалось добавить изображение, попробуйте снова");
        }
    };

    const tools = {
        embed: {
            class: Embed,
            config: {
                services: {
                    youtube: true,
                    vimeo: true,
                },
            },
        },
        list: { class: List, shortcut: 'CMD+SHIFT+L', inlineToolbar: true },
        checklist: { class: Checklist, shortcut: 'CMD+SHIFT+X', inlineToolbar: true },
        image: {
            class: ImageTool,
            shortcut: 'CMD+SHIFT+I',
            config: {
                uploader: { uploadByFile: uploadImageByFile },
                field: 'file',
                types: 'image/*',
                captionPlaceholder: 'Подпись к изображению...',
                buttonContent: 'Выберите изображение',
            },
        },
        header: {
            class: Header,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+H',
            config: {
                placeholder: "Введите заголовок...",
                levels: [2, 3],
                defaultLevel: 2,
            },
        },
        table: {
            class: Table,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+T',
            config: {
                rows: 2,
                cols: 3,
                maxRows: 20,
                maxCols: 10,
                stretched: true,
                withHeadings: true,
            },
        },
        quote: {
            class: Quote,
            shortcut: 'CMD+SHIFT+Q',
            inlineToolbar: true,
            config: {
                titlePlaceholder: 'Заголовок цитаты',
                messagePlaceholder: 'Текст цитаты',
            },
        },
        warning: {
            class: Warning,
            shortcut: 'CMD+SHIFT+W',
            inlineToolbar: true,
            config: {
                titlePlaceholder: 'Заголовок предупреждения',
                messagePlaceholder: 'Текст предупреждения',
            },
        },
        Math: {
            class: EJLaTeX,
            shortcut: 'CMD+SHIFT+M',
            config: {
                renderOnPaste: false,
                placeholder: 'Введите LaTeX формулу...',
            },
        },
        delimiter: { class: Delimiter, shortcut: 'CMD+SHIFT+D' },
        marker: Marker,
        code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+C',
            config: {
                placeholder: "Введите код...",
            },
        },
        inlineCode: InlineCode,
        nestedList: { class: NestedList, inlineToolbar: true, shortcut: 'CMD+SHIFT+N' },
        doodle: DoodleTool,
    };

    const getStorageKey = () => {
        return blog.id ? `blog_${blog.id}` : `blog_${uuidv4()}`;
    };

    const clearEditor = async () => {
        try {
            if (editorRef.current && editorRef.current.clear) {
                await editorRef.current.clear();
                setBlog(prevBlog => ({ ...prevBlog, content: { blocks: [] } }));
                toast.success("Редактор очищен");
            }
        } catch (error) {
            console.error("Ошибка при очистке редактора:", error);
            toast.error("Ошибка при очистке");
        }
        setShowClearConfirm(false);
    };

    const isReady = useRef(false);

    const initializeEditor = async (initialBlog) => {
        const editorContainer = document.getElementById('textEditor');
        if (!editorContainer) {
            console.error("Контейнер #textEditor не найден");
            return;
        }

        console.log("here's blog: => ", blog);

        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(part => part);
        const hasBlogIdInUrl = pathParts.length > 1 && pathParts[0] === 'editor' && pathParts[1];
        let initialData = { blocks: [] };

        console.log("initialBlog =>", initialBlog);

        if (hasBlogIdInUrl) {
            initialBlog = blog;
            initialData = blog.content[0] ? blog.content[0] : blog.content;
        } else if (initialBlog.content) {
            initialData = initialBlog.content;
        }

        console.log("initialData =>", initialData);

        try {
            if (!editorRef.current) {
                editorRef.current = new EditorJS({
                    holderId: "textEditor",
                    data: initialData,
                    tools: tools,
                    autofocus: true,
                    placeholder: "Начните писать здесь...",
                    onChange: debounce(async () => {
                        await saveData();
                    }, 2000),
                    i18n: {
                        messages: {
                            ui: {
                                blockTunes: {
                                    "toggler": {
                                        "Click to tune": "Настроить",
                                        "or drag to move": "или перетащить"
                                    },
                                },
                                inlineToolbar: {
                                    converter: {
                                        "Convert to": "Изменить",
                                    },
                                },
                                toolbar: {
                                    "toolbox": {
                                        "Add": "Добавить"
                                    }
                                },
                                "popover": {
                                    "Filter": "Поиск",
                                    "Nothing found": "Ничего не найдено"
                                },
                            },
                            toolNames: {
                                Text: "Текст",
                                Heading: "Заголовок",
                                List: "Список",
                                Checklist: "Чеклист",
                                Image: "Изображение",
                                Table: "Таблица",
                                Quote: "Цитата",
                                Warning: "Предупреждение",
                                Math: "Формула",
                                Delimiter: "Разделитель",
                                Marker: "Маркер",
                                Code: "Код",
                                InlineCode: "Встроенный код",
                                NestedList: "Вложенный список",
                                Embed: "Вставка",
                                doodle: "Рисунок",
                                "Link": "Ссылка",
                                "Bold": "Полужирный",
                                "Italic": "Курсив",
                                "InlineCode": "Встроенный код",
                            },
                            tools: {
                                header: {
                                    "Heading 2": "Заголовок 2",
                                    "Heading 3": "Заголовок 3",
                                },
                                image: {
                                    "Select an Image": "Выберите изображение",
                                    "With border": "С рамкой",
                                    "Stretch image": "Растянуть изображение",
                                    "With background": "С фоном",
                                },
                                table: {
                                    "Add column": "Добавить столбец",
                                    "Add row": "Добавить строку",
                                    "Delete column": "Удалить столбец",
                                    "Delete row": "Удалить строку",
                                    "Heading": "Заголовок",
                                },
                                list: {
                                    "Unordered": "Маркированный",
                                    "Ordered": "Нумерованный",
                                },
                                nestedList: {
                                    "Unordered": "Маркированный",
                                    "Ordered": "Нумерованный",
                                },
                                checklist: {
                                    "Add an item": "Добавить элемент",
                                },
                                embed: {
                                    "Enter a URL": "Введите URL",
                                },
                            },
                            blockTunes: {
                                "Convert to": "Изменить", 
                                "Filter": "Фильтр",
                                delete: {
                                    "Delete": "Удалить",
                                    "Click to delete": "Подтвердить удаление",
                                },
                                moveUp: {
                                    "Move up": "Переместить вверх",
                                },
                                moveDown: {
                                    "Move down": "Переместить вниз",
                                },
                            },
                            tunes: {
                                "Add": "Добавить",
                                "Delete": "Удалить",
                                "Move up": "Переместить вверх",
                                "Move down": "Переместить вниз",
                            },
                        },
                    },
                });
                isReady.current = true;
            } else if (initialData) {
                await editorRef.current.render(initialData);
            }

            if (initialBlog && !isReady.current) {
                setBlog(initialBlog);
            }
        } catch (error) {
            console.error("Ошибка при инициализации EditorJS:", error);
            toast.error("Не удалось загрузить редактор");
        }
    };

    const saveData = async () => {
        try {
            if (editorRef.current && editorRef.current.save) {
                const outputData = await editorRef.current.save();
                console.log("Данные из EditorJS:", outputData);

                const key = getStorageKey();
                await saveToIndexedDB(outputData, key, blog.id);
                setBlog(prevBlog => ({ ...prevBlog, content: { blocks: outputData.blocks } }));
            }
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const handleInitialDraftChoice = async (key) => {
        if (key === undefined) {
            onClose();
            return;
        }
        let initialBlog = null;
        if (key) {
            initialBlog = await loadFromIndexedDB(key);
        }
        await initializeEditor({ ...blogStructure, content: initialBlog });
        setBlog({ ...blogStructure, content: initialBlog });
        setShowInitialDraftModal(false);
    };

    const handleLoadDraft = async (key) => {
        const blogData = await loadFromIndexedDB(key);
        if (blogData) {
            const contentData = blogData.blocks ? blogData : { blocks: [] };
            if (editorRef.current && editorRef.current.render) {
                await editorRef.current.render(contentData);
                setBlog(prevBlog => ({
                    ...prevBlog,
                    content: contentData,
                }));
                toast.success(`Загружен блог ${key}`);
            }
        }
        setShowIndexedDBViewer(false);
    };

    useEffect(() => {
        console.log('useEffect triggered, blog:', blog);
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(part => part);
        const hasBlogIdInUrl = pathParts.length > 1 && pathParts[0] === 'editor' && pathParts[1];

        if (hasBlogIdInUrl) {
            const blogIdFromUrl = pathParts[1];
            if (blog?.id === blogIdFromUrl && blog?.content) {
                initializeEditor(blog);
            } else if (!isReady.current) {
                initializeEditor({ ...blogStructure, id: blogIdFromUrl });
            }
        } else if (!isReady.current) {
            setShowInitialDraftModal(true);
        }
    }, [blog]);

    return (
        <div className={`w-full min-h-screen mt-[60px] flex flex-col ${currentTheme}`}>
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Очистить редактор?</h3>
                        <p className="mb-4">Все данные в редакторе будут удалены. Это действие нельзя отменить.</p>
                        <div className="flex justify-around">
                            <button
                                onClick={clearEditor}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Да, очистить
                            </button>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInitialDraftModal && (
                <IndexedDBViewer
                    onLoad={handleInitialDraftChoice}
                    onClose={handleInitialDraftChoice}
                    isInitialLoad={true}
                />
            )}

            {showIndexedDBViewer && (
                <IndexedDBViewer
                    onLoad={handleLoadDraft}
                    onClose={() => setShowIndexedDBViewer(false)}
                    isInitialLoad={false}
                />
            )}

            <Toolbar
                editorRef={editorRef}
                setIsPaintOpen={setIsPaintOpen}
                setShowIndexedDBViewer={setShowIndexedDBViewer}
                setShowClearConfirm={setShowClearConfirm}
            />

            <div id="textEditor" className={`w-full top-auto ${currentTheme === "dark" ? "text-white" : ""}`}></div>

            {isPaintOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <DoodleThing onSave={handleSaveImage} onClose={() => setIsPaintOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default ContentEditor;