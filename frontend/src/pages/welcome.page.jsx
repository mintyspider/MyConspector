import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleSkip = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-[100vh-150px] top-[80px] flex flex-col items-center justify-between bg-white text-black px-4 md:px-8"
        >
            {/* Верхняя секция */}
            <motion.div
                className="text-center mt-8 md:mt-16"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">
                    Добро пожаловать!
                </h1>
                <p className="text-base lg:text-lg max-w-3xl mx-auto">
                    Присоединяйтесь к нашей платформе, чтобы учиться, делиться и вдохновляться. Здесь ваши знания становятся настоящей силой!
                </p>
            </motion.div>
            
            {/* Cекция: кнопка */}
            <motion.div
                className="center my-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <button
                    onClick={handleSkip}
                    className="px-6 py-3 md:px-8 md:py-4 border-purple/70 border-2 text-black rounded-full font-semibold text-sm md:text-lg shadow-md hover:bg-purple/30 transition duration-300"
                >
                    Исследовать
                </button>
            </motion.div>

            {/* Карточки преимуществ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-3 lg:my-20 max-w-6xl lg:w-full max-lg:w-[80%] max-lg:mx-auto px-4">
                {[
                    {
                        title: 'Создавайте контент',
                        description: 'Создавайте уникальные конспекты и структурируйте свои идеи.',
                        icon: '✍️',
                    },
                    {
                        title: 'Делитесь знаниями',
                        description: 'Обменивайтесь своими работами и находите единомышленников.',
                        icon: '🤝',
                    },
                    {
                        title: 'Развивайтесь',
                        description: 'Исследуйте новые горизонты и становитесь лучше каждый день.',
                        icon: '🚀',
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-sm hover:shadow-lg hover:shadow-purple shadow-dark-grey transition duration-300 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div className="text-2xl lg:text-5xl mb-4">{item.icon}</div>
                        <h2 className="text-md lg:text-xl font-bold mb-2">{item.title}</h2>
                        <p className="text-sm lg:text-base">{item.description}</p>
                    </motion.div>
                ))}
            </div>

            
        </motion.div>
    );
};

export default WelcomePage;
