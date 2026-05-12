import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import validateData from "../../utils/validation.js";


export default function RegisterPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateData(setErrors, {email, password, confirmPassword})) {
            // Логика запроса на бэк
            navigate('/');
        }

    }

    return (
        <div className="mainContainer">
            <form onSubmit={() => handleSubmit(e)}>
                <label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {!email && <span>Почта</span>}
                    {errors.email && <span>{errors.email}</span>}
                </label>
                <label htmlFor="">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!password && <span>Пароль</span>}
                    {errors.password && <span>{errors.password}</span>}
                </label>
                <label htmlFor="">
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {!confirmPassword && <span>Подтверждение пароля</span>}
                    {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                </label>
                <Link to="/">Уже есть аккаунт?</Link>

                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    )
}