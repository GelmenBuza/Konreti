import {useEffect, useState} from "react";
import {useNavigate} from "react-router";


export default function RegisterPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const checkData = () => {
        const newErrors = {}
        const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
        const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

        if (!email) {
            newErrors.email = 'Почта обязательна.';
        }

        if (!emailRegEx.test(email)) {
            newErrors.email = 'Не валидная почта.';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен.';
        }

        if (!passwordRegEx.test(password)) {
            newErrors.password = 'Пароль должен быть от 8 символов. Содержать как минимум одну строчную, одну заглавную букву и одну цифру.';
        }

        if (!confirmPassword || confirmPassword !== password) {
            newErrors.confirmPassword = 'Пароли не совпадают.';
        }

        setError(newErrors);

        return !newErrors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (checkData()) {
            // Логика запроса на бэк
            navigate('/login');
        }

    }

    return (
        <div className="mainContainer">
            <form onSubmit={() => handleSubmit(e)}>
                <label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {!email && <span>Почта</span>}
                    {error.email && <span>{error.email}</span>}
                </label>
                <label htmlFor="">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!password && <span>Пароль</span>}
                    {error.password && <span>{error.password}</span>}
                </label>
                <label htmlFor="">
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {!confirmPassword && <span>Подтверждение пароля</span>}
                    {error.confirmPassword && <span>{error.confirmPassword}</span>}
                </label>

                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    )
}