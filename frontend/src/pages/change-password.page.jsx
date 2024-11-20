import React, { useContext, useRef } from 'react'
import AnimationWrapper from './../common/page-animation';
import InputBox from './../components/input.component';
import {Toaster, toast} from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App';

const ChangePassword = () => {
    let changePasswordForm = useRef();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    let { userAuth: { accessToken } } = useContext(UserContext);
    console.log(accessToken);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(changePasswordForm.current);
        console.log(accessToken);
        let form = new FormData(changePasswordForm.current);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        let { oldpassword, newpassword, newpassword2 } = formData;
        if(!oldpassword.length || !newpassword.length || !newpassword2.length){
            return toast.error("Заполните все поля");
        }
        if(!passwordRegex.test(oldpassword) || !passwordRegex.test(newpassword) || !passwordRegex.test(newpassword2)){
            return toast.error("Неправильный формат пароля: 6-20 символов, хотя бы одна цифра, одна заглавная и одна строчная буква");
        }
        if (newpassword !== newpassword2) {
            return toast.error("Пароли не совпадают");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Изменение пароля...");

        let data = { oldpassword, newpassword };
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/changepassword", data, { headers: { Authorization: `Bearer ${accessToken}` } }).then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success("Пароль успешно изменен o(*^＠^*)o");
            e.target.removeAttribute("disabled");
        })
        .catch(({ response }) => {
            toast.error("Произошла ошибка o.O");
        });
        console.log(data);
    }
    return (
        <AnimationWrapper>
            <Toaster/>
            <form autoComplete="off" ref={changePasswordForm}>
                <h1 className='max-md:hidden text-2xl font-medium text-dark-grey text-center'>Сменить пароль</h1>

                <div className='w-full md:max-w-[400px] mx-auto py-10'>
                    <h4 className='mt-5 mb-2 text-dark-grey text-center md:text-left text-xl'>Старый пароль</h4>
                    <InputBox name="oldpassword" type="password" placeholder="Старый пароль" icon="lock" className="profile-edit-input"/>
                    <h4 className='mt-5 mb-2 text-dark-grey text-center md:text-left text-xl'>Новый пароль</h4>
                    <InputBox name="newpassword" type="password" placeholder="Новый пароль" icon="lock" className="profile-edit-input"/>
                    <InputBox name="newpassword2" type="password" placeholder="Повторите пароль" icon="lock" className="profile-edit-input"/>

                    <button className='btn-dark w-full px-10 mt-5' type='submit' onClick={handleSubmit}>Сменить</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword
