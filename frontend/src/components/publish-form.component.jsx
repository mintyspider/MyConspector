import React, { useContext, useEffect } from 'react';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';
import Tags from './tags.component';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

const PublishForm = () => {
  const { setEditorState, setBlog, blog, blog:{ title, tags, des, content } } = useContext(EditorContext);

  let { userAuth: {accessToken} } = useContext(UserContext);
  let {blog_id} = useParams();

  useEffect(() => {
    console.log('Состояние blog обновлено:', blog);
  }, [blog]); // Сработает, когда blog изменится

  let navigate = useNavigate();

  let characterLimit = 200;
  let tagLimit = 10;
  
  const handleClose = () => {
    console.log("Current blog data:", blog);

    setEditorState("editor");
    console.log("Updated blog data sent back to editor:", blog);
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    setBlog({...blog, title: input.value})
  }

  const handleDesChange = (e) => {
    let input = e.target;
    setBlog({...blog, des: input.value})
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
  }

  const handleTopic = (e) => {
    if(e.keyCode == 13 ){
      e.preventDefault();
      let tag = e.target.value.toLowerCase();
      if(tags.length < tagLimit){
        if(!tags.includes(tag) && tag.length){
          setBlog({...blog, tags : [...tags, tag ]})
        }
      } else{
        toast.error(`Максимальное количество меток: ${tagLimit}`)
      }
      e.target.value = "";
    }
  }

  const publishBlog = (e) => {

    // Блокируем кнопку, если она уже нажата
    if (e.target.classList.contains('disable')){
      e.target.classList.add('bg-dark-grey');
      return;
    }

    // Проверка заголовка
    if(!title.length){
      return toast.error("Озаглавьте конспект");
    }

    // Проверка описания
    if(!des.length || des.length > characterLimit){
      return toast.error(`Добавьте описение конспекту (допустимый объем символов - ${characterLimit})`);
    }

    // Проверка меток (тегов)
    if(!tags.length || tags.length > tagLimit){
      return toast.error(`Добавьте хотя бы одну метку конспекту (не более ${tagLimit})`);
    }

    // Проверка контента (EditorJS)
    if (!content || !content.blocks || !content.blocks.length) {
      console.log("=) :", content.blocks)
      return toast.error("Добавьте контент конспекту");
      
    }

    let loadingToast = toast.loading("Публикация...");

    // Блокируем кнопку
    e.target.classList.add('disable');

    let blogObj = { 
      title,
      des, 
      content: { blocks: content.blocks }, // Оборачиваем в объект с ключом `blocks`
      tags, 
      draft: false 
    };
    

    // Отправляем запрос на сервер
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/createblog', {...blogObj, id: blog_id}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(() => {
      // Разблокируем кнопку
      e.target.classList.remove('disable');
      e.target.classList.remove('bg-dark-grey');

      toast.dismiss(loadingToast);
      toast.success("Публикация завершена");

      // Перенаправление через 500 мс
      setTimeout(() => {
        navigate("/");
      }, 500);
    }).catch(({ response }) => {
      // Разблокируем кнопку при ошибке
      e.target.classList.remove('disable');
      e.target.classList.remove('bg-dark-grey');

      toast.dismiss(loadingToast);

      // Выводим ошибку сервера, если она есть
      if (response && response.data && response.data.error) {
        console.log(response.data.error);
        return toast.error(response.data.error);
      }

      return toast.error("Произошла ошибка при публикации");
    });
};


  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <Toaster />
        <button 
          className='w-12 h-12 absolute right-[5vh] z-10 top-[5%] lg:top-[10%]'
          onClick={handleClose}
        >
          <i className='fi fi-rr-cross'></i>
        </button>

        <div className='max-w-[550px] center'>
          <p className="text-dark-grey mb-1">Предпросмотр</p>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>

          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{ des }</p>
        </div>

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='text-dark-grey mb-2 mt-9'>Заголовок конспекта</p>
          <input type="text" placeholder='Заголовок' defaultValue={title} className='input-box pl-4' onChange={handleTitleChange}/>

          <p className='text-dark-grey mb-2 mt-9'>Описание конспекта</p>
          <textarea defaultValue={des} maxLength={characterLimit} placeholder='Описание' className='h-40 resize-none leading-7 input-box pl-4' onChange={handleDesChange} onKeyDown={handleKeyDown}></textarea>

          <p className='mt-1 text-dark-grey text-sm text-right'>{ characterLimit - des.length } / { characterLimit } </p>

          <p className='text-dark-grey mb-2 mt-9'>Метки - (помогают пользователям в поиске необходимой информации)</p>

          <div className='relative input-box pl-2 py-2 pb-4'>
            <input type="text" placeholder='Метка' className='sticky font-normal text-dark-grey input-box bg-white top-0 left-0 pl-4 mb-5 focus:bg-white' 
            onKeyDown={handleTopic}/>
            
            {
              tags.map((tag, i) => {
                return <Tags tag={tag} key={i} />
              })
            }

          </div>
          
          <p className='mt-1 text-dark-grey text-sm text-right'>{ tagLimit - tags.length } / { tagLimit } </p>
        
            <button className='btn-dark px-8' onClick={publishBlog}>Опубликовать</button>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default PublishForm;
