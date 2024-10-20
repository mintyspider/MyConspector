import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';

const BlogStructure = {
  title: '',
  content: [],
  tags: [],
  des: '',
  author: {personal_info: { } }
}

export const EditorContext = createContext({});

const EditorPage = () => {

    let { blog_id } = useParams();

    const [blog, setBlog] = useState(BlogStructure);

    const [editorState, setEditorState] = useState("editor");

    const [loading, setLoading] = useState(true);
    
    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;

    useEffect(() => {

        if (!blog_id) {
          setLoading(false);
    })

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState}}>
      {
        accessToken === null ? 
        <Navigate to="/signin" />
        : editorState == "editor" ? 
          <BlogEditor />
        : <PublishForm />
      }
    </EditorContext.Provider>
  )
}

export default EditorPage
