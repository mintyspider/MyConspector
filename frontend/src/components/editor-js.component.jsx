import React, { useEffect, useRef, useContext } from 'react';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
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

const ContentEditor = () => {
    const { blog, setBlog, blog : { content } } = useContext(EditorContext);

    const editorRef = useRef(null);

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

    const tools = {
        embed: Embed,
        list: {
            class: List,
            inlineToolbar: true
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        image: {
            class: Image,
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
            config: {
                placeholder: "Место для заголовка...",
                levels: [2, 3],
                defaultLevel: 2
            }
        },
        // ? Что добавить в таблицу?
        table: {
            class: Table,
            inlineToolbar: true,
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
            inlineToolbar: true,
        },
        warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
                titlePlaceholder: 'Title',
                messagePlaceholder: 'Message',
            },
        },
        Math: {
            class: EJLaTeX,
            config: {
                renderOnPaste: false,
            }
        },
        delimiter: Delimiter,
        marker: Marker,
        code: CodeTool,
        inlineCode: InlineCode,
        nestedList: {
            class: NestedList,
            inlineToolbar: true,
        }
    };

    const saveData = async () => {
        try {
            const outputData = await editorRef.current.save();
            console.log('Сохраненные данные:', outputData);
            setBlog(prevBlog => ({ ...prevBlog, content: {blocks: outputData.blocks} })); // Обновляем состояние
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
        <div className="toolbar">
            <button onClick={() => editorRef.current.blocks.insert('header')}><i className="fi fi-rr-square-h"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('list')}><i className="fi fi-rr-rectangle-list"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('quote')}><i className="fi fi-rr-comment-quote"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('image')}><i className="fi fi-rr-comment-image"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('warning')}><i className="fi fi-rr-exclamation"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('code')}><i className="fi fi-rr-terminal"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('delimiter')}><i className="fi fi-rr-grid-dividers"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('table')}><i className="fi fi-rr-table-list"></i></button>
            <button onClick={() => editorRef.current.blocks.insert('checklist')}><i className="fi fi-rr-list-check"></i></button>
        </div>
        {/* Контейнер редактора */}
        <div id="textEditor" className="editor-container"></div>
    </div>
)};

export default ContentEditor;
