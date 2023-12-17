import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }
  
  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password)
  }

  return (
    <div className="auth">
      <section className="auth__main">
        <h2 className="auth__title">Вход</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input className="auth__input auth__email-input"
          placeholder="Email" type="email" value={email}
          maxLength="40" onChange={handleEmailChange} required />
          <input className="auth__input auth__password-input"
          placeholder="Пароль" type="password" onChange={handlePasswordChange} value={password}
          minLength="1" maxLength="40" autoComplete="off" required />
          <button className="auth__submit-button" type="submit">Войти</button>
        </form>
      </section>
    </div>
  );
}