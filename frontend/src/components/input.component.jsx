import React from 'react'

const InputBox = ({ name, type, id, value, placeholder, icon }) => {

    const [passwordVisible, setPasswordVisible] = useState(false)
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

  return (
    <div className='relative w-[100%] mb-4'>
        <input 
            name={name}
            type={type}
            placeholder={placeholder}
            id={id}
            defaultValue={value}
            icon={icon}
            className='input-box'
            />
        
        {
            type=='password' ?
            passwordVisible ?
            <i className='input-icon fi fi-rr-lock cursor-pointer' onClick={togglePasswordVisibility()}></i>
            : <i className='input-icon fi fi-rr-unlock cursor-pointer' onClick={togglePasswordVisibility()}></i>
            : <i className={'fi fi-rr-' + icon + ' input-icon'}></i>
        }
    </div>
  )
}

export default InputBox
