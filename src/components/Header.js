import React from 'react';
import { Route, Link } from 'react-router-dom';
import headerLogo from '../images/header-logo.svg';

function Header({ headerMail, signOut }) {
    const [isMenuClick, setMenuClick] = React.useState(false);

    function handleMenuClick() {
        setMenuClick(!isMenuClick);
    }

    return (
        <header className="header">
            <div className={`header__menu ${isMenuClick ? "header__menu_box-nav" : ""}`}>
                <img className={`header__logo ${isMenuClick ? "header__logo_box-menu" : ""}`} src={headerLogo} alt="Лого Место" />
                    <Route exact path="/">
                        <div className={`header__button-menu ${isMenuClick ? "header__button-menu_close" : ""}`} onClick={handleMenuClick}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={`header__info ${isMenuClick ? "header__info_box-menu" : ""}`}>
                            <p className="header__mail">{headerMail}</p>
                            <Link to="/sign-in" className="header__out" onClick={() => {
                                signOut();
                                handleMenuClick();
                            }}>Выйти</Link>
                        </div>
                    </Route>

                    <Route path="/sign-in">
                        <div className="header__sign-block">
                            <Link to="/sign-up" className="header__sign">Регистрация</Link>
                        </div>
                    </Route>

                    <Route path="/sign-up">
                        <div className="header__sign-block">
                            <Link to="/sign-in" className="header__sign">Войти</Link>
                        </div>
                    </Route>
            </div>
        </header>
    );
}

export default Header;
