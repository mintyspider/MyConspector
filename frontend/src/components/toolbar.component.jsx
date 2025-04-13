import React, { useState } from 'react';

const Toolbar = ({ editorRef, setIsPaintOpen, setShowIndexedDBViewer, setShowClearConfirm }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
        className="fixed top-[80px] left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 z-20 transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden',
          height: isExpanded ? '80px' : '50px',
        }}
      >
        <div className="flex justify-center items-center gap-4 p-2 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <button
              onClick={toggleToolbar}
              className="p-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <i className="fi fi-rr-angle-up text-lg"></i>
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