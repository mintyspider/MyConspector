import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../imgs/logo.png"
import AnimationWrapper from '../common/page-animation'
import defaultPannel from "../imgs/blog_banner.png"

const BlogEditor = () => {

    const handleBannerUpload = (e) => {
        console.log(e);
        let image = e.target.files[0];

        console.log(image);

        
    }
  return (
    <>
        <nav className='navbar'>
                <Link to="/" className='flex-none w-12'>
                    <img src={logo} />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full text-bold text-2xl'>Новый конспект</p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 flex gap-2'>
                    <i className="fi fi-rr-file-upload mt-1"></i>
                        Опубликовать
                    </button>
                    <button className='btn-light py-2 flex gap-2'>
                    <i className="fi  fi-rr-disk text-dark-grey mt-1"></i>
                        Сохранить черновик
                    </button>
                </div>
        </nav>

        <AnimationWrapper>
            <section>
                <div className='mx-auto max-w-[900px] w-full'>
                    <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80'>
                        <label htmlFor='uploadBanner'>
                            <img src={defaultPannel} className='z-20' />
                            <input 
                            id="uploadBanner"
                            type='file'
                            accept='.png, .jpg, .jpeg'
                            hidden
                            onChange={handleBannerUpload}
                            />
                        </label>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    </>
  )
}

export default BlogEditor
