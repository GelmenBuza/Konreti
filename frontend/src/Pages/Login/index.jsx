import { useState } from "react";
import { Link, useNavigate } from "react-router";
import validateData from "../../utils/validation.js";
import styles from "./style.module.css";
import authApi from "../../api/authApi.js";
import { userStore } from "../../stores/userStore.js";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = userStore();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateData(setErrors, { email, password }, 'login')) {
            const req = await authApi.login(email, password);

            if (!req.error) {
                if (req.user) {
                    const newUser = req.user;
                    console.log(newUser);
                    setUser(newUser);
                    navigate(`/profile`);
                }
            } else {
                alert(req.message);
            }
        }
    }

    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.logo}>Kanreti</h1>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
                <h2 className={styles.formTitle}>Вход</h2>
                <div className={styles.inputContainer}>
                    <label htmlFor="email" className={`${styles.inputLabel} ${errors.email ? styles.error : ''}`}>
                        <input id="email" type="email" value={email} placeholder="Почта"
                            onChange={(e) => setEmail(e.target.value)} className={styles.inputField} />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </label>
                    <label htmlFor="password" className={`${styles.inputLabel} ${errors.password ? styles.error : ''}`}>
                        <input id="password" type="password" value={password} placeholder="Пароль"
                            onChange={(e) => setPassword(e.target.value)} className={styles.inputField} />
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </label>
                </div>
                <Link to="/register" className={styles.registrationLink}>Нет аккаунта?</Link>

                <button type="submit" className={styles.submitButton}>Войти</button>
            </form>
        </div>
    )
}