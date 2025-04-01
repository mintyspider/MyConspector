import React, { useState } from 'react';
import Tooltip from './tooltip.component';

const Toolbar = ({ editorRef, setIsPaintOpen, setShowIndexedDBViewer, setShowClearConfirm }) => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleToolbar = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="toolbar flex py-1 px-2 max-lg:hidden">
            <div 
                className="toggle-btn" 
                onClick={toggleToolbar}
                style={{ 
                    position: 'absolute', 
                    left: isVisible ? '80px' : '10px', 
                    cursor: 'pointer', 
                    padding: '4px' 
                }}
            >
                <i className={`fi fi-sr-${isVisible ? 'left' : 'right'} text-purple text-lg`}></i>
            </div>
            {isVisible && (
                <div
                    style={{
                        width: '60px',
                    }}
                >
                    <div className="flex flex-col gap-1">
                        {/* Форматирование */}
                        <Tooltip onClick={() => editorRef.current.blocks.insert('header')} tooltipText="Заголовок" tooltipPosition="right">
                            <i className="fi fi-rr-square-h text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('list')} tooltipText="Список" tooltipPosition="right">
                            <i className="fi fi-rr-rectangle-list text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('checklist')} tooltipText="Чеклист" tooltipPosition="right">
                            <i className="fi fi-rr-list-check text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('quote')} tooltipText="Цитата" tooltipPosition="right">
                            <i className="fi fi-rr-comment-quote text-lg"></i>
                        </Tooltip>

                        {/* Вставка */}
                        <Tooltip onClick={() => editorRef.current.blocks.insert('image')} tooltipText="Изображение" tooltipPosition="right">
                            <i className="fi fi-rr-comment-image text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => setIsPaintOpen(true)} tooltipText="Рисунок" tooltipPosition="right">
                            <i className="fi fi-rr-pencil text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('code')} tooltipText="Код" tooltipPosition="right">
                            <i className="fi fi-rr-terminal text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('table')} tooltipText="Таблица" tooltipPosition="right">
                            <i className="fi fi-rr-table-list text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => editorRef.current.blocks.insert('delimiter')} tooltipText="Разделитель" tooltipPosition="right">
                            <i className="fi fi-rr-grid-dividers text-lg"></i>
                        </Tooltip>

                        {/* Управление */}
                        <Tooltip onClick={() => editorRef.current.blocks.insert('warning')} tooltipText="Важно" tooltipPosition="right">
                            <i className="fi fi-rr-exclamation text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => setShowIndexedDBViewer(true)} tooltipText="Черновики" tooltipPosition="right">
                            <i className="fi fi-rr-folder-open text-lg"></i>
                        </Tooltip>
                        <Tooltip onClick={() => setShowClearConfirm(true)} tooltipText="Очистить редактор" tooltipPosition="right">
                            <i className="fi fi-rr-trash text-lg"></i>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Toolbar;