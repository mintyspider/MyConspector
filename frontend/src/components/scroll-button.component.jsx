import React, { useState, useEffect } from 'react';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);

  // Обновлённая логика видимости
  const toggleVisibility = () => {
    const scrollY = window.pageYOffset;
    const shouldBeVisible = scrollY > 300 || (scrollY <= 300 && lastScrollPosition !== null);
    setIsVisible(shouldBeVisible);
    setIsAtTop(scrollY <= 300);
  };

  // Прокрутка вверх с сохранением позиции
  const scrollToTop = () => {
    if (!isAtTop) {
      const currentPosition = window.pageYOffset;
      setLastScrollPosition(currentPosition);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Возврат к последней позиции с сбросом
  const scrollToLastPosition = () => {
    if (lastScrollPosition !== null) {
      window.scrollTo({
        top: lastScrollPosition,
        behavior: 'smooth',
      });
      setLastScrollPosition(null); // Сбрасываем после возврата
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [lastScrollPosition]); // Добавляем зависимость от lastScrollPosition

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={isAtTop && lastScrollPosition !== null ? scrollToLastPosition : scrollToTop}
          className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-full shadow-lg hover:bg-purple-600 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none animate-slide-up"
          title={isAtTop && lastScrollPosition !== null ? 'Вернуться к предыдущей позиции' : 'Наверх'}
        >
          <i
            className={`fi fi-rr-angle-${isAtTop && lastScrollPosition !== null ? 'down' : 'up'} text-xl`}
          ></i>
        </button>
      )}
    </div>
  );
};

export default ScrollButton;