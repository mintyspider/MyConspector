import React, { createContext, useContext, useState } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';

const BlogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: {personal_info: { } }
}

export const EditorContext = createContext({});

const EditorPage = () => {

    const [blog, setBlog] = useState(BlogStructure);

    const [editorState, setEditorState] = useState("editor");

    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;

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
