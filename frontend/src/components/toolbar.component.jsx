import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const Toolbar = ({
  editorRef,
  setIsPaintOpen,
  setShowIndexedDBViewer,
  setShowClearConfirm,
  saveToIndexedDB,
  blogId,
  setBlog,
  blog, // Теперь принимаем весь blog
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastContentRef = useRef(null);

  const toggleToolbar = () => {
    setIsVisible((prev) => {
      console.log('Toolbar visibility toggled to:', !prev);
      return !prev;
    });
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      console.log('Toolbar expanded toggled to:', !prev);
      return !prev;
    });
  };

  // Проверка editorRef перед использованием
  const insertBlock = (type) => {
    if (editorRef.current && editorRef.current.blocks) {
      console.log(`Inserting block: ${type}`);
      editorRef.current.blocks.insert(type);
    } else {
      console.error('EditorJS not initialized or blocks unavailable');
    }
  };

  // Сохранение в IndexedDB
  const handleSave = async () => {
    if (!editorRef.current) {
      console.error('EditorJS not initialized');
      return;
    }

    try {
      const content = await editorRef.current.save();
      if (!content.blocks || content.blocks.length === 0) {
        console.log('No content to save');
        return;
      }

      // Формируем полный объект blog
      const dataToSave = { ...blog, content: { blocks: content.blocks } };

      // Сравниваем с последним сохранённым состоянием
      const contentString = JSON.stringify(dataToSave);
      if (contentString === lastContentRef.current) {
        console.log('No changes detected, skipping save');
        return;
      }

      setIsSaving(true); // Включаем подсветку
      console.log('Saving to IndexedDB:', dataToSave);

      // Сохраняем с фиксированным ключом current_draft
      await saveToIndexedDB(dataToSave, 'current_draft', blogId);

      // Обновляем состояние blog
      setBlog(dataToSave);

      lastContentRef.current = contentString; // Обновляем последний контент
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Ошибка при сохранении');
    } finally {
      setTimeout(() => setIsSaving(false), 1000); // Выключаем подсветку через 1 сек
    }
  };

  // Автосохранение каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 10000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [editorRef, blogId, saveToIndexedDB, setBlog, blog]);

  return (
    <>
      <div
        className="fixed top-[80px] left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300"
        style={{ opacity: isVisible ? 0 : 1, visibility: isVisible ? 'hidden' : 'visible' }}
      >
        <button
          onClick={toggleToolbar}
          className="flex items-center justify-center px-4 py-1 bg-gray-200 text-gray-900 rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-sm">Показать</span>
          <i className="fi fi-sr-angle-down ml-2 text-base"></i>
        </button>
      </div>

      <div
        className="fixed top-[80px] left-0 w-full bg-white dark:bg-gray-800 z-20 transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          height: isExpanded ? '70px' : '50px',
        }}
      >
        <div className="flex justify-center items-center gap-4 p-2 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <button
              onClick={toggleToolbar}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className={`fi fi-rr-${isExpanded ? 'cross-circle' : 'angle-up'} text-lg`}></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Скрыть</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={toggleExpand}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className={`fi fi-rr-angle-${isExpanded ? 'up' : 'down'} text-lg`}></i>
            </button>
            {isExpanded && (
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {isExpanded ? 'Свернуть' : 'Развернуть'}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('header')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-square-h text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Заголовок</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('list')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-rectangle-list text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Список</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('checklist')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-list-check text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Чеклист</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('quote')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-comment-quote text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Цитата</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('image')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-comment-image text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Изображение</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsPaintOpen(true)}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-pencil text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Рисунок</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('code')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-terminal text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Код</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('table')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-table-list text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Таблица</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('delimiter')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-grid-dividers text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Разделитель</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => insertBlock('warning')}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-exclamation text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Важно</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowIndexedDBViewer(true)}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-folder-open text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Записи</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={handleSave}
              className={`p-2 transition-colors ${
                isSaving
                  ? 'text-purple'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <i className="fi fi-rr-disk text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Сохранить</span>}
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-trash text-lg"></i>
            </button>
            {isExpanded && <span className="text-xs text-gray-700 dark:text-gray-300">Очистить</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;