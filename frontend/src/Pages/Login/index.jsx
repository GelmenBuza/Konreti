import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import validateData from "../../utils/validation.js";


export default function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateData(setErrors, {email, password})) {
            // Логика запроса на бэк
            const userId = 1
            navigate(`/profile`);
        }

    }

    return (
        <div className="mainContainer">
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="email">
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {!email && <span>Почта</span>}
                    {error.email && <span>{error.email}</span>}
                </label>
                <label htmlFor="password">
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!password && <span>Пароль</span>}
                    {error.password && <span>{error.password}</span>}
                </label>

                <Link to="/registration">Нет аккаунта?</Link>

                <button type="submit">Войти</button>
            </form>
        </div>
    )
}