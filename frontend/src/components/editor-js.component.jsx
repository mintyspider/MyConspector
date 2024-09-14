import React, { useEffect, useRef, useContext } from 'react';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
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
        quote: {
            class: Quote,
            inlineToolbar: true,
        },
        marker: Marker,
        inlineCode: InlineCode
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
                data: content.blocks,
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

    return <div id="textEditor" className='font-gelasio'></div>;
};

export default ContentEditor;
