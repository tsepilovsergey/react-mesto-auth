import React from 'react';
import { Link } from 'react-router-dom';

function Register({ handleRegister }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleChange(event) {
        if (event.target.name === 'Email') {
            setEmail(event.target.value);
        } else if (event.target.name === 'Password') {
            setPassword(event.target.value);
        }
    }

    function resetForm() {
        setEmail('');
        setPassword('');
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!email || !password) {
            console.log('Не введен email или пароль');
            return;
        }
        handleRegister(email, password);
        resetForm()
    }

    return (
        <section className="sign">
            <h3 className="sign__title">Регистрация</h3>
            <form className="sign__form" name="formSign" onSubmit={handleSubmit} noValidate>
                <input value={email} onChange={handleChange} className="sign__input" name="Email" type="email" autoComplete="off" placeholder="Email" required />
                <input value={password} onChange={handleChange} className="sign__input" name="Password" type="password" autoComplete="off" placeholder="Пароль" required />
                <button className="sign__button" type="submit">
                    Зарегистрироваться
                </button>
            </form>
            <p className="sign__text">
                Уже зарегистрированы?{" "}
                <Link to="/sign-in" className="sign__link">
                    Войти
                </Link>
            </p>
        </section>
    );
}

export default Register;
