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

const ContentEditor = () => {
    const { blog, setBlog } = useContext(EditorContext);
    let content = blog.content || [];  // Default to an empty array if blog or content is undefined

    let { theme } = useContext(ThemeContext);
    const currentTheme = theme;
    const editorRef = useRef(null);
    const [isPaintOpen, setIsPaintOpen] = useState(false); // Состояние для отображения PaintPage

    const uploadImageByFile = async (file) => {
        const storageRef = ref(storage, `files/${file.name}`);
        const toastId = toast.loading("Загрузка...");

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            toast.success("Загрузка завершена", { id: toastId });
            return {
                success: 1,
                file: {
                    url: downloadURL
                }
            };
        } catch (error) {
            toast.error("Ошибка при загрузке файла", { id: toastId });
            console.error("Ошибка при загрузке файла:", error);
            return {
                success: 0,
                file: {
                    url: null
                }
            };
        }
    };

    const handleSaveImage = (imageUrl) => {
        setIsPaintOpen(false); // Закрываем PaintPage после сохранения

        // Создаем блок изображения для EditorJS
        const imageBlock = {
            type: 'image',
            data: {
                file: {
                    url: imageUrl,
                },
                caption: '', // Описание изображения (можно оставить пустым)
                stretched: false,
                withBackground: false,
                withBorder: false,
            },
        };

        // Добавляем блок изображения в EditorJS
        editorRef.current.blocks.insert('image', imageBlock.data);
    };

    const tools = {
        embed: Embed,
        list: {
            class: List,
            shortcut: 'CMD+SHIFT+L',
            inlineToolbar: true
        },
        checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+X',
            inlineToolbar: true,
        },
        image: {
            class: ImageTool,
            shortcut: 'CMD+SHIFT+I',
            config: {
                uploader: {
                    uploadByUrl: async (url) => {
                        toast.loading("Загрузка...");
                        try {
                            toast.success("Загрузка завершена");
                            return {
                                success: 1,
                                file: { url }
                            };
                        } catch (err) {
                            toast.error("Ошибка при загрузке файла");
                            console.error("Ошибка при загрузке файла:", err);
                            return {
                                success: 0,
                                file: {
                                    url: null
                                }
                            };
                        }
                    },
                    uploadByFile: uploadImageByFile,
                }
            }
        },
        header: {
            class: Header,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+H',
            config: {
                placeholder: "Место для заголовка...",
                levels: [2, 3],
                defaultLevel: 2
            }
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
                titlePlaceholder: 'Заголовок',
                messagePlaceholder: 'Цитата',
            },
        },
        warning: {
            class: Warning,
            shortcut: 'CMD+SHIFT+W',
            inlineToolbar: true,
            config: {
                titlePlaceholder: 'Заголовок',
                messagePlaceholder: 'Заметка',
            },
        },
        Math: {
            class: EJLaTeX,
            shortcut: 'CMD+SHIFT+M',
            config: {
                renderOnPaste: false,
            }
        },
        delimiter: {
            class: Delimiter,
            shortcut: 'CMD+SHIFT+D',
        },
        marker: Marker,
        code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+C',
            config: {
                placeholder: "Место для кода...",
            }
        },
        inlineCode: InlineCode,
        nestedList: {
            class: NestedList,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+N',
        }
    };

    const saveData = async () => {
        try {
            const outputData = await editorRef.current.save();
            console.log('Сохраненные данные:', outputData);
            setBlog(prevBlog => ({ ...prevBlog, content: { blocks: outputData.blocks } })); // Обновляем состояние
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    };

    const isReady = useRef(false);

    useEffect(() => {
        if (!isReady.current) {
            editorRef.current = new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Не бойся начать с чистого листа...",
                onChange: async () => {
                    await saveData();
                }
            });
            isReady.current = true;
        }
    }, []); // Только один раз при монтировании

    useEffect(() => {
        console.log('Состояние blog обновлено:', blog);
    }, [blog]); // Сработает, когда blog изменится

    return (
        <div>
            {/* Панель инструментов */}
            <div className="toolbar max-md:hidden">
                <button onClick={() => editorRef.current.blocks.insert('header')}><i className="fi fi-rr-square-h"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('list')}><i className="fi fi-rr-rectangle-list"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('quote')}><i className="fi fi-rr-comment-quote"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('image')}><i className="fi fi-rr-comment-image"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('warning')}><i className="fi fi-rr-exclamation"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('code')}><i className="fi fi-rr-terminal"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('delimiter')}><i className="fi fi-rr-grid-dividers"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('table')}><i className="fi fi-rr-table-list"></i></button>
                <button onClick={() => editorRef.current.blocks.insert('checklist')}><i className="fi fi-rr-list-check"></i></button>
                <button onClick={() => setIsPaintOpen(true)}><i className="fi fi-rr-pencil"></i></button> {/* Кнопка для открытия PaintPage */}
            </div>
            {/* Контейнер редактора */}
            <div id="textEditor" className={"editor-container" + (currentTheme == "dark" ? "-dark" : "")}></div>

            {/* Окно для рисования */}
            {isPaintOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <DoodleThing onSave={handleSaveImage} onClose={() => setIsPaintOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default ContentEditor;