import React, { useContext, useEffect } from 'react';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';
import Tags from './tags.component';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

const PublishForm = () => {
  const { setEditorState, setBlog, blog, blog: { title, tags, des, content } } = useContext(EditorContext);
  let { userAuth: { accessToken } } = useContext(UserContext);
  let { blog_id } = useParams();

  useEffect(() => {
    console.log('Состояние blog обновлено:', blog);
  }, [blog]);

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
    setBlog({ ...blog, title: input.value });
    console.log('Title updated:', input.value);
  };

  const handleDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
    console.log('Description updated:', input.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTopic = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      let tag = e.target.value.toLowerCase();
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
          console.log('Tag added:', tag);
        }
      } else {
        toast.error(`Максимальное количество меток: ${tagLimit}`);
      }
      e.target.value = "";
    }
  };

  const publishBlog = (e) => {
    if (e.target.classList.contains('disable')) {
      e.target.classList.add('bg-dark-grey');
      return;
    }

    if (!title.length) {
      return toast.error("Озаглавьте конспект");
    }

    if (!des.length || des.length > characterLimit) {
      return toast.error(`Добавьте описание конспекту (допустимый объем символов - ${characterLimit})`);
    }

    if (!tags.length || tags.length > tagLimit) {
      return toast.error(`Добавьте хотя бы одну метку конспекту (не более ${tagLimit})`);
    }

    let loadingToast = toast.loading("Публикация...");
    e.target.classList.add('disable');

    let blogObj = {
      title,
      des,
      content: { blocks: content.blocks },
      tags,
      draft: false,
    };

    console.log('Publishing blog:', blogObj);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + '/createblog',
        { ...blogObj, id: blog_id },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        e.target.classList.remove('disable');
        e.target.classList.remove('bg-dark-grey');
        toast.dismiss(loadingToast);
        toast.success("Публикация завершена");
        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove('disable');
        e.target.classList.remove('bg-dark-grey');
        toast.dismiss(loadingToast);
        if (response && response.data && response.data.error) {
          console.log('Publish error:', response.data.error);
          return toast.error(response.data.error);
        }
        return toast.error("Произошла ошибка при публикации");
      });
  };

  return (
    <AnimationWrapper>
      <section className='w-full fixed top-0 left-0 h-screen flex items-start justify-center bg-white z-50 overflow-y-auto'>
        <button
          className='w-12 h-12 absolute right-4 top-4 z-10'
          onClick={handleClose}
        >
          <i className='fi fi-rr-cross'></i>
        </button>

        <div className='w-full lg:p-6 bg-white rounded-lg mt-4'>
          <h1 className='text-3xl font-medium mb-6 leading-tight'>Последние шаги ᓚᘏᗢ</h1>
          
          <p className='text-dark-grey mb-2'>Заголовок конспекта</p>
          <input
            type="text"
            placeholder='Заголовок'
            value={title}
            className='input-box pl-4 w-full mb-4'
            onChange={handleTitleChange}
          />

          <p className='text-dark-grey mb-2'>Описание конспекта</p>
          <textarea
            value={des}
            maxLength={characterLimit}
            placeholder='Описание'
            className='h-32 resize-none leading-7 input-box pl-4 w-full mb-4'
            onChange={handleDesChange}
            onKeyDown={handleKeyDown}
          ></textarea>

          <p className='text-dark-grey text-sm text-right mb-4'>
            {characterLimit - des.length} / {characterLimit}
          </p>

          <p className='text-dark-grey mb-2'>Метки. Для добавления нажмите Enter ^_^</p>
          <div className='input-box pl-2 py-2 mb-4'>
            <input
              type="text"
              placeholder='Метка'
              className='w-full font-normal text-dark-grey input-box bg-white pl-4 mb-3 focus:bg-white'
              onKeyDown={handleTopic}
            />

            {tags.map((tag, i) => (
              <Tags tag={tag} key={i} />
            ))}
          </div>

          <p className='text-dark-grey text-sm text-right mb-6'>
            {tagLimit - tags.length} / {tagLimit}
          </p>

          <button 
            className='btn-dark px-8 py-2 rounded-md'
            onClick={publishBlog}
          >
            Опубликовать
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;