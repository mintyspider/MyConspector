import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../imgs/logo.png";
import AnimationWrapper from '../common/page-animation';
import defaultPannel from "../imgs/blog_banner.png";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase';
import { EditorContext } from '../pages/editor.pages';
import { toast, Toaster } from 'react-hot-toast';
import ContentEditor from './editor-js.component';

const BlogEditor = () => {
    const { blog, setBlog, editorState, setEditorState } = useContext(EditorContext);
    const [bannerImage, setBannerImage] = useState(blog.banner || defaultPannel);

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `banners/${file.name}`);
            const toastId = toast.loading("Загрузка...");
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                console.log("Download URL:", downloadURL);
                toast.success("Загрузка завершена", { id: toastId });

                // Обновляем состояние баннера и блога
                setBannerImage(downloadURL);
                setBlog(prevBlog => ({ ...prevBlog, banner: downloadURL }));

            } catch (error) {
                toast.error("Ошибка при загрузке файла");
                console.error("Ошибка при загрузке файла:", error);
            }
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;

        // Обновление состояния заголовка
        setBlog(prevBlog => ({ ...prevBlog, title: input.value }));
        console.log("title:", e.target.value);
    }

    const handleError = (e) => {
        const img = e.target;
        img.src = defaultPannel;
    }

    const handlePublish = () => {
        console.log("blog: ", blog);
        // Проверка перед публикацией
        if (!blog.banner.length) {
            return toast.error("Необходимо загрузить баннер");
        }
        if (!blog.title.length) {
            return toast.error("Необходимо озаглавить конспект");
        }
        if (!blog.content.length) {
            return toast.error("Необходимо заполнить конспект");
        }
        setEditorState("publish");
    }

    return (
        <>
            <Toaster />
            <nav className='navbar'>
                <Link to="/" className='flex-none w-12'>
                    <img src={logo} alt="Logo" />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full text-bold text-2xl'>
                    {blog.title.length ? blog.title : "Новый конспект"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 flex gap-2'
                        onClick={handlePublish}>
                        <i className="fi fi-rr-file-upload mt-1"></i>
                        Опубликовать
                    </button>
                    <button className='btn-light py-2 flex gap-2'>
                        <i className="fi fi-rr-disk text-dark-grey mt-1"></i>
                        Сохранить черновик
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80'>
                            <label htmlFor='uploadBanner'>
                                <img src={bannerImage} className='z-20' alt="Banner" onError={handleError} />
                                <input
                                    id="uploadBanner"
                                    type='file'
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            placeholder='Тема конспекта'
                            className='text-4xl font-medium w-full h-13 outline-none text-center resize-none mt-7 leading-tight placeholder:opacity-40'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                            value={blog.title}
                        />

                        <hr className='w-full opacity-10 my-5' />

                        <ContentEditor value={blog.content}/>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
