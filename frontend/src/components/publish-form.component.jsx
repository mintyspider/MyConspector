import React, { useContext } from 'react';
import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';

const PublishForm = () => {
  const { setEditorState, blog } = useContext(EditorContext);

  const handleClose = () => {
    console.log("Current blog data:", blog);
    // Возвращаемся к редактору и передаем текущее состояние blog обратно
    setEditorState("editor");
    console.log("Updated blog data sent back to editor:", blog);
  };

  return (
    <AnimationWrapper>
      <section>
        <Toaster />
        <button 
          className='w-12 h-12 absolute right-[5vh] z-10 top-[5%] lg:top-[10%]'
          onClick={handleClose}
        >
          <i className='fi fi-rr-cross'></i>
        </button>
      </section>
    </AnimationWrapper>
  );
}

export default PublishForm;
