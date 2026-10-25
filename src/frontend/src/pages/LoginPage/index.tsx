import { NavLink } from "react-router-dom"
import styles from "./style.module.css"
import authService from "../../api/authService"
import type { LoginCredentials } from "../../types/auth"
import { useState } from "react"

export const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")

  const handleButtonClick = async () => {
    setError("")
    if (credentials.password) {
      try {
        await authService.login(credentials);
        if (authService.hasRole("admin")) {
          window.location.href = "/admin/main";
        } else {
          window.location.href = "/main";
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message.includes("422") ? "Неверные данные" : "");
        } else {
          setError("Ошибка при попытке войти");
        }
        console.log("Error:", err);
      }
    } else {
      setError("Пароль не может быть пустым");
    }
  }

  return (
    <>
      <div className={styles.main}>
        <h1>Вход в личный кабинет</h1>
        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="text"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            id="email"
            className={styles.inputField}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            type="text"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="password"
            className={styles.inputField}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className={styles.btn} onClick={handleButtonClick}>
          Войти
        </button>
        <span>Впервые в Соковищнице?</span>
        <NavLink to="/register" className={styles.register}>
          Создайте аккаунт
        </NavLink>
      </div>
    </>
  )
}
