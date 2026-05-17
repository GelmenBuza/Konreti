import { useState } from "react";
import { Link, useNavigate } from "react-router";
import validateData from "../../utils/validation.js";
import styles from "./style.module.css";
import authApi from "../../api/authApi.js";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateData(setErrors, { email, password, confirmPassword, fullName })) {
            const req = await authApi.register(email, password, fullName);
            if (req) {
                navigate('/');
            } else {
                setErrors({global: req.message})
            }
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
                            onChange={(e) => setEmail(e.target.value)} className={styles.inputField} />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </label>
                    <label htmlFor="fullName" className={`${styles.inputLabel} ${errors.fullName ? styles.error : ''}`}>
                        <input id="fullName" type="text" value={fullName} placeholder="Никнейм"
                            onChange={(e) => setFullName(e.target.value)} className={styles.inputField} />
                        {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                    </label>
                    <label htmlFor="password" className={`${styles.inputLabel} ${errors.password ? styles.error : ''}`}>
                        <input id="password" type="password" value={password} placeholder="Пароль"
                            onChange={(e) => setPassword(e.target.value)} className={styles.inputField} />
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </label>
                    <label htmlFor="confirmPassword" className={`${styles.inputLabel} ${errors.confirmPassword ? styles.error : ''}`}>
                        <input id="confirmPassword" type="password" value={confirmPassword} placeholder="Подтверждение пароля"
                            onChange={(e) => setConfirmPassword(e.target.value)} className={styles.inputField} />
                        {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                    </label>
                </div>
                <Link to="/" className={styles.registrationLink}>Уже есть аккаунт?</Link>

                <button type="submit" className={styles.submitButton}>Зарегистрироваться</button>
            </form>
        </div>
    )
}