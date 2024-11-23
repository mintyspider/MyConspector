import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { profileDataStructure } from "./profile.page";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from './../common/page-animation';
import axios from "axios";
import InputBox from "../components/input.component";
import Loader from "../components/loader.component";

const EditProfile = () => {
    let { userAuth: { accessToken, username } } = useContext(UserContext);

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    let [charactersLeft, setCharactersLeft] = useState(200);
    let profileImg = useRef();

    let bioLength = 200;

    let { personal_info, personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLength - e.target.value.length);
        let input = e.target;
        if (input.value.length > bioLength) {
            input.value = input.value.slice(0, bioLength);
        }
        setProfile((prev) => ({
            ...prev,
            personal_info: { ...prev.personal_info, bio: input.value },
        }));
        return charactersLeft;
    };

    const [avatar, setAvatar] = useState(profile_img);
    console.log("avatar=>", avatar);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `avatars/${file.name}`);
            const toastId = toast.loading("Загрузка...");
            try {
                // Загружаем файл в Firebase Storage
                await uploadBytes(storageRef, file);

                // Получаем URL загруженного файла
                const downloadURL = await getDownloadURL(storageRef);
                console.log("Download URL:", downloadURL);

                toast.success("Загрузка завершена", { id: toastId });

                // Обновляем состояние аватара и профиля
                setAvatar(downloadURL);
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    personal_info: { ...prevProfile.personal_info, profile_img: downloadURL },
                }));

                // Отправляем URL на сервер
                await axios.post(
                    `${import.meta.env.VITE_SERVER_DOMAIN}/newavatar`,
                    { profileImg: downloadURL },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
            } catch (error) {
                toast.error("Ошибка при загрузке файла");
                console.error("Ошибка при загрузке файла:", error);
            } finally {
                toast.dismiss(toastId);
                console.log("user=>", personal_info);
            }
        }
    };

    const handleUsername = (e) => {
        let input = e.target;
        setProfile((prev) => ({
            ...prev,
            personal_info: { ...prev.personal_info, username: input.value },
        }));
    };
    
    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            social_links: { ...prev.social_links, [name]: value },
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Сохранение профиля...");
        console.log("Submitting Profile:", profile); // Ensure this is the latest profile state
    
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/updateprofile`,
                profile,  // Send the updated profile
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success("Профиль обновлён!", { id: toastId });
        } catch (error) {
            toast.error("Ошибка сохранения профиля", { id: toastId });
            console.error("Ошибка сохранения профиля:", error);
        }
    };    

    const showNewAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileImg.current.src = URL.createObjectURL(file);
        }
    };

    useEffect(() => {
        if (accessToken) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/getprofile", { username })
                .then(({ data }) => {
                    console.log("edit profile =>", data);
                    setProfile(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    return (
        <AnimationWrapper>
            {loading ? <Loader /> :

                <form onSubmit={handleSaveProfile}>
                    <Toaster />
                    <h1 className='max-md:hidden text-2xl lg:text-3xl font-medium text-dark-grey text-center'>Редактировать профиль</h1>
                    <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                        <div className='max-lg:center mb-5'>
                            <label htmlFor='avatar' id='avatarLabel' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white bg-dark-grey/60 opacity-0 hover:opacity-100 cursor-pointer text-3xl'>
                                    <i className="fi fi-rr-upload cursor-pointer"></i>
                                    <span>Загрузить</span>
                                </div>
                                <img src={avatar} ref={profileImg} alt="Аватар" />
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                accept=".jpg, .jpeg, .png"
                                hidden
                                onChange={(e) => {
                                    handleAvatarChange(e);
                                    showNewAvatar(e);
                                }}
                            />
                        </div>

                        <div className='w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                <div>
                                    <InputBox name="fullname" type="text" id="fullname" value={fullname} placeholder="Ваше имя" icon="user" disable={true} />
                                </div>
                                <div>
                                    <InputBox name="email" type="email" id="email" value={email} placeholder="Email" icon="envelope" disable={true} />
                                </div>
                            </div>
                            <div className="relative group">
                                <InputBox
                                    name="username"
                                    type="text"
                                    id="username"
                                    value={profile_username}
                                    placeholder="Псевдоним"
                                    icon="at"
                                    className="focus:outline-none"
                                    onChange={handleUsername}
                                />
                                <div className="absolute top-full left-0 w-full mt-2 hidden p-4 text-sm text-white bg-dark-grey rounded shadow-lg group-hover:block group-hover:z-10">
                                    Псевдоним используется для упрощения поиска пользователей и отображается для всех пользователей.
                                    Псевдоним можно изменять неограниченное количество раз.
                                    Пожалуйста, не используйте кириллический алфавит, пробелы и специальные символы,
                                    которые могут повлиять на функциональность сайта, а также остерегайтесь нецензурных выражений.
                                    <br />Спасибо за понимание （づ￣3￣）づ╭❤️～
                                </div>
                            </div>

                            <textarea name="bio" maxLength={bioLength} placeholder="О себе" defaultValue={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' onChange={handleCharacterChange}></textarea>
                            <p className='text-sm text-dark-grey items-end mt-1'>{bioLength - charactersLeft}/{bioLength}</p>

                            <p className='my-5 text-xl text-dark-grey'>Контакты для связи</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
                                {
                                    Object.keys(social_links).map((key) => {
                                        let link = social_links[key];
                                        return (
                                            <InputBox
                                                key={key}
                                                name={key}
                                                type="text"
                                                id={key}
                                                value={link}
                                                placeholder={key}
                                                icon={"fi " + (key !== 'website' ? "fi-brands-" + key : 'fi-rr-globe')}
                                                onChange={handleSocialLinkChange}
                                            />
                                        );
                                    })
                                }
                            </div>
                            <button className='btn-light hover:bg-dark-grey hover:text-white mt-5 max-lg:center lg:w-full px-10' type='submit'>Сохранить</button>
                        </div>
                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile;
