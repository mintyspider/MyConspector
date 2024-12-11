import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomePage = () => {
    const navigate = useNavigate();
    
    const handleExplore = () => {
        localStorage.setItem('tourCompleted', false);
        navigate('/tour');
    };

    const handleSkip = () => {
        localStorage.setItem('tourCompleted', true);
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-purple-100 to-blue-50 text-gray-800 px-6"
        >
            {/* Верхняя секция */}
            <div className="flex flex-col items-center mt-12">
                {/* Логотип */}
                <motion.img
                    src="/path-to-logo.png" // Укажите путь к вашему логотипу
                    alt="Platform Logo"
                    className="w-24 h-24 mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                />
                {/* Заголовок */}
                <motion.h1
                    className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-700"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Добро пожаловать на платформу знаний!
                </motion.h1>
                {/* Подзаголовок */}
                <motion.p
                    className="text-lg md:text-xl text-center max-w-2xl mb-8 text-gray-700"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Создавайте, делитесь и вдохновляйтесь. Это место, где идеи обретают форму, а знания становятся силой!
                </motion.p>
            </div>

            {/* Карточки преимуществ */}
            <div className="flex flex-wrap gap-6 justify-center mb-10 max-w-4xl">
                {[
                    {
                        title: 'Создавайте уникальные конспекты',
                        description: 'Структурируйте знания и создавайте вдохновляющий контент.',
                    },
                    {
                        title: 'Делитесь с сообществом',
                        description: 'Обменивайтесь идеями и находите единомышленников.',
                    },
                    {
                        title: 'Развивайте себя',
                        description: 'Находите вдохновение и поддерживайте постоянный рост.',
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <h2 className="text-lg md:text-xl font-semibold mb-2 text-purple-600">
                            {item.title}
                        </h2>
                        <p className="text-gray-600">{item.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Нижняя секция: кнопки */}
            <div className="flex gap-6 mb-12">
                <button
                    onClick={handleExplore}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg text-md md:text-lg font-semibold shadow-md hover:bg-purple-700 transition"
                >
                    Посмотреть возможности
                </button>
                <button
                    onClick={handleSkip}
                    className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg text-md md:text-lg font-semibold shadow-md hover:bg-gray-400 transition"
                >
                    Пропустить
                </button>
            </div>
        </motion.div>
    );
};

export default WelcomePage;
