import { createThemes } from 'tw-colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontSize: {
            'sm': '12px',
            'base': '14px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '28px',
            '4xl': '38px',
            '5xl': '50px',
        },

        extend: {
            fontFamily: {
                inter: ["'Inter'", "sans-serif"],
                gelasio: ["'Gelasio'", "serif"]
            },
        },

    },
    plugins: [
        createThemes({
            light: {
                'white': '#FFFFFF', // Белый
                'black': '#242424', // Глубокий чёрный
                'grey': '#F3F3F3',  // Светлый серый
                'dark-grey': '#6B6B6B', // Тёмно-серый
                'red': '#FF4E4E',   // Ярко-красный
                'transparent': 'transparent', // Прозрачный
                'purple': '#8B46FF', // Насыщенный фиолетовый
                'orange': '#FF9245'  // Ярко-оранжевый
            },
            dark: {
                'white': '#000000',  // Чёрный вместо белого
                'black': '#FFFFFF',  // Белый вместо чёрного
                'grey': '#2A2A2A',   // Тёмный серый заменён светлым серым
                'dark-grey': '#E7E7E7', // Светло-серый вместо тёмно-серого
                'red': '#FF6B6B',    // Более мягкий красный (немного светлее)
                'transparent': 'transparent', // Прозрачный остаётся неизменным
                'purple': '#8B46FF', // Светлый фиолетовый
                'orange': '#FFB678'  // Светло-оранжевый для баланса
            }
        })
    ],
};