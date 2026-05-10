export default function validateData (setErrors, fields){

    const newErrors = {}
    const emailRegEx = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

    if (!fields.email) {
        newErrors.email = 'Почта обязательна.';
    } else if (!emailRegEx.test(fields.email)) {
        newErrors.email = 'Почты не существует.';
    }

    if (!fields.password) {
        newErrors.password = 'Пароль обязателен.';
    } else if (!passwordRegEx.test(fields.password)) {
        if (fields.confirmPassword) {
            newErrors.password = 'Пароль должен быть от 8 символов. Содержать как минимум одну строчную, одну заглавную букву и одну цифру.';
        } else {
            newErrors.password = 'Не верный пароль.';

        }
    }

    if (!fields.confirmPassword || fields.confirmPassword !== fields.password) {
        newErrors.confirmPassword = 'Пароли не совпадают.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
}