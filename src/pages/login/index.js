import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

export default function Login() {
  // Gerenciando estados
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mensagens de erro ou sucesso
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');

  async function login(e) {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setMessage('');

    const data = {
      email,
      password,
    }

    try {
      const response = await api.post('api/login', data);

      localStorage.setItem('access_token', response.data.response.access_token);

      navigate('/dashboard/home');

    } catch (err) {

      if (err.response && err.response.data) {

        const { email, password } = err.response.data.message;

        if (email === undefined && password === undefined) {
          setMessage(err.response.data.message);
        }

        if (email) {
          setEmailError(email[0]);
        }
        if (password) {
          setPasswordError(password[0]);
        }

      } else {
        setMessage('Um erro ocorreu. Por favor, tente novamente mais tarde.');

      }
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100 loginPage">
        <div className="col-md-6 col-lg-4 p-3 rounded border loginForm">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={login}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite o email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                autoComplete="off"
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite a senha"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
              />
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              {message && <div className="text-danger mt-2">{message}</div>}
            </div>
            <button type="submit" className="btn btn-success w-100">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
