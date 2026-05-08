import {useEffect, useState} from "react";
import {useNavigate} from "react-router";


export default function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            newErrors.email = 'Почты не существует.';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен.';
        }

        if (!passwordRegEx.test(password)) {
            newErrors.password = 'Не верный пароль.';
        }

        setError(newErrors);

        return !newErrors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (checkData()) {
            // Логика запроса на бэк
            const userId = 1
            navigate(`/profile/${userId}`);
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

                <button type="submit">Войти</button>
            </form>
        </div>
    )
}