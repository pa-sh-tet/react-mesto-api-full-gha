import React, { useState } from "react";
import {Link} from 'react-router-dom';

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }
  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit (e) {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className="auth">
      <section className="auth__main">
        <h2 className="auth__title">Регистрация</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input className="auth__input auth__email-input"
          placeholder="Email" type="email"
          minLength="2" maxLength="40" value={email}
          onChange={handleEmailChange} required/>
          <input className="auth__input auth__password-input"
          placeholder="Пароль" type="password"
          minLength="2" maxLength="40" value={password}
          onChange={handlePasswordChange} autoComplete="off" required />
          <button className="auth__submit-button" type="submit">Зарегистрироваться</button>
        </form>
        <Link to="/sign-in" className="auth__login-link">Уже зарегистрированы? Войти</Link>
      </section>
    </div>
  );
}