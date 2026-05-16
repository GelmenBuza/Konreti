import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import validateData from "../../utils/validation.js";
import styles from "../Login/style.module.css";


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
        <div className={styles.mainContainer}>
            <h1 className={styles.logo}>Kanreti</h1>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
                <h2 className={styles.formTitle}>Регистрация</h2>
                <div className={styles.inputContainer}>
                    <label htmlFor="email" className={`${styles.inputLabel} ${errors.email ? styles.error : ''}`}>
                        <input id="email" type="email" value={email} placeholder="Почта"
                               onChange={(e) => setEmail(e.target.value)} className={styles.inputField}/>
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </label>
                    <label htmlFor="password" className={`${styles.inputLabel} ${errors.password ? styles.error : ''}`}>
                        <input id="password" type="password" value={password} placeholder="Пароль"
                               onChange={(e) => setPassword(e.target.value)} className={styles.inputField}/>
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </label>
                    <label htmlFor="confirmPassword" className={`${styles.inputLabel} ${errors.confirmPassword ? styles.error : ''}`}>
                        <input id="confirmPassword" type="password" value={confirmPassword} placeholder="Подтверждение пароля"
                               onChange={(e) => setConfirmPassword(e.target.value)} className={styles.inputField}/>
                        {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                    </label>
                </div>
                <Link to="/" className={styles.registrationLink}>Уже есть аккаунт?</Link>

                <button type="submit" className={styles.submitButton}>Зарегистрироваться</button>
            </form>
        </div>
    )
}