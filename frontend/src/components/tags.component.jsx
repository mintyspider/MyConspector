import React, { useContext } from 'react'
import { EditorContext } from "../pages/editor.pages"

const Tags = ({ tag, tagIndex }) => {

    let { blog: { tags }, setBlog, blog } = useContext(EditorContext)

    const handleTagDelete = (e) => {
      tags = tags.filter(t => t != tag);
      setBlog({ ...blog, tags: tags })
    }

    const handleTagEdit = (e) => {
      if(e.keyCode == 13 ){
        e.preventDefault();
        let currentTag = e.target.innerText.toUpperCase();
        tags[tagIndex] = currentTag;
        setBlog({...blog, tags: tags})
        e.target.setAttribute("contentEditable", false)
      }
    }

    const addEditable = (e) => {
      e.target.setAttribute("contextEditable", true);
      e.target.focus()
    }
    
  return (
    <div className='relative p--2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
      <p className='outline-none' onKeyDown={handleTagEdit} onClick={addEditable} ># { tag }</p>
      <button className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'
      onClick={handleTagDelete}>
        <i className='fi fi-rr-cross text-sm pointer-events-none'></i>
      </button>
    </div>
  )
}

export default Tags
