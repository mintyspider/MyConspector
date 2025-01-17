import React, { useContext, useRef, useState } from 'react';
import AnimationWrapper from './../common/page-animation';
import InputBox from './../components/input.component';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App';

const ChangePassword = () => {
    const changePasswordForm = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const { userAuth: { accessToken } } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Блокировка повторных отправок

        const form = new FormData(changePasswordForm.current);
        const formData = Object.fromEntries(form.entries());
        const { oldpassword, newpassword, newpassword2 } = formData;

        // 1. Проверка на заполненность всех полей
        if (!oldpassword || !newpassword || !newpassword2) {
            return toast.error('Заполните все поля (⊙_☉)');
        }

        // 2. Проверка на соответствие требованиям
        if (!passwordRegex.test(oldpassword) || !passwordRegex.test(newpassword) || !passwordRegex.test(newpassword2)) {
            return toast.error('Неправильный формат пароля (╯°□°）╯: 6-20 символов, хотя бы одна цифра, одна заглавная и одна строчная буква');
        }

        // 3. Проверка на совпадение паролей
        if (newpassword !== newpassword2) {
            return toast.error('Пароли не совпадают (ಥ﹏ಥ)');
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('Изменение пароля... (・・;)');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/changepassword`,
                { oldpassword, newpassword },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.dismiss(loadingToast);
            toast.success('Пароль успешно изменен (ノ・∀・)ノ');
            changePasswordForm.current.reset(); // Сброс формы после успешного изменения
        } catch (error) {
            toast.dismiss(loadingToast);

            if (error.response?.status === 401) {
                // Если сервер сообщает, что старый пароль неверен
                toast.error('Старый пароль неверен (¬_¬)');
            } else {
                const errorMessage = error.response?.data?.message || 'Произошла ошибка o.O';
                toast.error(`${errorMessage} ¯\\_(ツ)_/¯`);
            }
        } finally {
            setIsSubmitting(false); // Разблокировка кнопки
        }
    };

    return (
        <AnimationWrapper>
            <Toaster />
            <form autoComplete="off" ref={changePasswordForm} onSubmit={handleSubmit}>
                <h1 className="max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center">Сменить пароль</h1>

                <div className="w-full md:max-w-[400px] mx-auto py-10">
                    <h4 className="mt-5 mb-2 text-dark-grey text-center md:text-left text-xl">Старый пароль</h4>
                    <InputBox name="oldpassword" type="password" placeholder="Старый пароль" icon="lock" className="profile-edit-input" />
                    <h4 className="mt-5 mb-2 text-dark-grey text-center md:text-left text-xl">Новый пароль</h4>
                    <InputBox name="newpassword" type="password" placeholder="Новый пароль" icon="lock" className="profile-edit-input" />
                    <InputBox name="newpassword2" type="password" placeholder="Повторите пароль" icon="lock" className="profile-edit-input" />

                    <button
                        className={`btn-dark w-full px-10 mt-5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Изменение... (・・;)' : 'Сменить'}
                    </button>
                </div>
            </form>
        </AnimationWrapper>
    );
};

export default ChangePassword;
