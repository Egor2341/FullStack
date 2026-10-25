import styles from "./style.module.css"
import authService from "../../api/authService"
import type { RegisterData } from "../../types/auth"
import { useState } from "react"

export const RegisterPage = () => {
  const [data, setData] = useState<RegisterData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")

  const handleButtonClick = async () => {
    setError("")
    if (data.password && data.password === data.confirmPassword){
      try {
        await authService.register(data)
        window.location.href = "/login"
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("422")){
            setError("Пользователь с таким email уже существует")
          }
        } else {
          setError("Ошибка при попытке регистрации")
        }
        console.log("Error:", err)
      }
    } else {
      setError("Проверьте пароли")
    }
  }

  return (
    <>
      <div className={styles.main}>
        <h1>Регистрация</h1>
        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="text"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            id="email"
            className={styles.inputField}
          />{" "}
        </div>
        <div>
          <label htmlFor="name" className={styles.label}>
            Пароль
          </label>
          <input
            type="text"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            id="password"
            className={styles.inputField}
          />{" "}
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            Повторите пароль
          </label>
          <input
            type="text"
            value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            id="confirm_password"
            className={styles.inputField}
          />{" "}
        </div>
        {error && <div className="error">{error}</div>}
        <button className={styles.btn} onClick={handleButtonClick}>Создать личный кабинет</button>
      </div>
    </>
  )
}
