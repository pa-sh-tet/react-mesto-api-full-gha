import { Link, useLocation } from 'react-router-dom';
import React from 'react';

export default function Header({ email, isLoggedIn, signOut }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__logo"></div>
      {isLoggedIn && <h3 className="header__email">{email}</h3>}
      {location.pathname === '/sign-in' && <Link to="sign-up" className="header__path">
        Регистрация
      </Link>}
      {location.pathname === '/sign-up' && <Link to="sign-in" className="header__path">
        Войти
      </Link>}
      {isLoggedIn && <Link to='/sign-in' className="header__path header__path_unactive" onClick={signOut}>
        Выйти
      </Link>}
    </header>
    );
}