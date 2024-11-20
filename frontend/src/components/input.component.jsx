import React, { useState } from 'react';

const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }) => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <div className='relative w-[100%] mb-4'>
            <input 
                name={name}
                type={passwordVisible && type === 'password' ? 'text' : type} // меняем тип поля, если пароль виден
                placeholder={placeholder}
                id={id}
                defaultValue={value}
                disabled={disable}
                className='input-box'
            />
            
            { type === 'password' ? 
                (
                <i 
                    className={`input-icon fi fi-rr-${passwordVisible ? 'unlock' : 'lock'} cursor-pointer`} 
                    onClick={togglePasswordVisibility}
                ></i>
                ) 

            : icon.slice(0, 6) == "brands" 
                ? (<i className={`fi fi-${icon} input-icon`}></i>) 
                : (<i className={`fi fi-rr-${icon} input-icon`}></i>)
            }
        </div>
    )
}

export default InputBox;
