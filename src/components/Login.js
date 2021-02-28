import React from 'react';

function Login({ handleLogin }) {
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
        handleLogin(email, password);
        resetForm()
    }

    return (
        <section className="sign">
            <h3 className="sign__title">Вход</h3>
            <form className="sign__form" name="formSign" onSubmit={handleSubmit} noValidate>
                <input value={email} onChange={handleChange} className="sign__input" name="Email" type="email" autoComplete="off" placeholder="Email" required />
                <input value={password} onChange={handleChange} className="sign__input" name="Password" type="password" autoComplete="off" placeholder="Пароль" required />
                <button className="sign__button" type="submit">
                    Войти
                </button>
            </form>
        </section>
    )
}

export default Login;
