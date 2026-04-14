import { useNavigate } from "react-router-dom"
import styles from "./button.module.css"

export const Main = () => {
  const navigate = useNavigate()

  return (
    <button
      className={styles.btn}
      onClick={() => {
        navigate("/main")
      }}
    >
      На главную
    </button>
  )
}
