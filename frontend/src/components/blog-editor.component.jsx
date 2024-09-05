import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../imgs/logo.png";
import AnimationWrapper from '../common/page-animation';
import defaultPannel from "../imgs/blog_banner.png";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase';  // Путь к вашему файлу конфигурации

const BlogEditor = () => {
    const [bannerImage, setBannerImage] = useState(defaultPannel);

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `gs://myconspector.appspot.com/${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                console.log("Download URL:", downloadURL); // Проверьте, что URL верен
                setBannerImage(downloadURL);
            } catch (error) {
                console.error("Ошибка при загрузке файла:", error);
            }
        }
    };

    const handleTitleKeyDown = (e) => {
        if(e.keyCode == 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
    }

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-12'>
                    <img src={logo} alt="Logo" />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full text-bold text-2xl'>
                    Новый конспект
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 flex gap-2'>
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
                                <img src={bannerImage} className='z-20' alt="Banner" />
                                <input 
                                    id="uploadBanner"
                                    type='file'
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea placeholder='Тема конспекта' className='text-4xl font-medium w-full h-13 outline-none text-center resize-none mt-10 leading-tight placeholder:opacity-40'
                        onKeyDown={handleTitleKeyDown} 
                        onChange={handleTitleChange}>
                        </textarea>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
