import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from "../imgs/logo.png";
import AnimationWrapper from '../common/page-animation';
import { EditorContext } from '../pages/editor.pages';
import { toast, Toaster } from 'react-hot-toast';
import ContentEditor from './editor-js.component';
import axios from 'axios';
import { ThemeContext, UserContext } from '../App';
import { blogStructure } from '../pages/blog.page';

const BlogEditor = () => {
    const { setEditorState, setBlog, blog, blog:{ title, tags, des, content } } = useContext(EditorContext);
    let {blog_id} = useParams();

    useEffect(() => {
      if (!blog_id) {
        setBlog(blogStructure);
      }
  }, [blog_id, setBlog]);

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
        let { title, content } = blog;
        console.log("title:", title, "content:", content[0] ? content[0].blocks : content.blocks);
        // Проверка перед публикацией
        if (!title.length) {
            return toast.error("Озаглавьте конспект");
        }
        if (content[0]){
          if(!content[0].blocks.length){
            return toast.error("Добавьте содержание конспекту");
          }
        } else {
          if (!content.blocks.length) {
            return toast.error("Добавьте контент конспекту");
            
          }
        }
        
        setEditorState("publish");
    }

    let { userAuth: {accessToken} } = useContext(UserContext);
    const { theme, setTheme } = useContext(ThemeContext);

    const changeTheme = () => {
        console.log("clicked")
        let newTheme = theme == "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.setAttribute("data-theme", newTheme);
        storeInSession("theme", newTheme);
    }

    let navigate = useNavigate();

    const handleSave = (e) => {
        // Блокируем кнопку, если она уже нажата
    if (e.target.classList.contains('disable')){
        e.target.classList.add('bg-grey');
        return;
      }
  
      // Проверка заголовка
      if(!title.length){
        return toast.error("Озаглавьте конспект");
      }
  
      let loadingToast = toast.loading("Сохранение черновика...");
  
      // Блокируем кнопку
      e.target.classList.add('disable');
  
      let blogObj = { 
        title,  
        des, 
        content: content[0] ? {content: content[0].blocks} : { content: content.blocks }, // Оборачиваем в объект с ключом `blocks`
        tags, 
        draft: true 
      };
      
      // Отправляем запрос на сервер
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/createblog', {...blogObj, id: blog_id}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(() => {
        // Разблокируем кнопку
        e.target.classList.remove('disable');
        e.target.classList.remove('bg-grey');
  
        toast.dismiss(loadingToast);
        toast.success("Сохранение завершено");
  
        // Перенаправление через 500 мс
        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 500);
      }).catch(({ response }) => {
        // Разблокируем кнопку при ошибке
        e.target.classList.remove('disable');
        e.target.classList.remove('bg-grey');
  
        toast.dismiss(loadingToast);
  
        // Выводим ошибку сервера, если она есть
        if (response && response.data && response.data.error) {
          console.log(response.data.error);
          return toast.error(response.data.error);
        }
  
        return toast.error("Произошла ошибка при сохранении");
      });
  };

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className='flex-none w-12'>
                    <img src={logo} alt="Logo" />
                </Link>
                <button className='w-12 h-12 rounded-full flex items-center justify-center' onClick={changeTheme}>
                    { theme == 'light' ?
                    <i className="fi fi-rr-moon-stars block text-dark-grey text-2xl mt-2"></i>
                    : <i className="fi fi-rr-sun block mt-2 text-dark-grey text-2xl"></i>
                    }
                </button>
                <p className='max-md:hidden text-black line-clamp-1 w-full text-bold text-2xl'>
                    {blog.title ? blog.title : "Новый конспект"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 flex gap-2'
                        onClick={handlePublish}>
                        <i className="fi fi-rr-file-upload mt-1"></i>
                        Опубликовать
                    </button>
                    <button className='btn-light py-2 flex gap-2'
                        onClick={handleSave}>
                        <i className="fi fi-rr-disk text-dark-grey mt-1"></i>
                        Сохранить черновик
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section className='w-full'>
                        <textarea
                            placeholder='Тема конспекта'
                            className='text-4xl font-medium w-full h-13 outline-none text-center resize-none mt-7 leading-tight placeholder:opacity-40'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                            value={blog.title}
                        />

                        <hr className='w-full opacity-10 my-5' />

                        <ContentEditor value={blog.content}/>
                    
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
