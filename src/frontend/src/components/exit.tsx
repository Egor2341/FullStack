import authService from "../api/authService"
import styles from "./button.module.css"
import { MdOutlineExitToApp } from "react-icons/md"

export const Exit = () => {
  return (
    <button
      className={styles.btn}
      onClick={() => {
        authService.logout()
      }}
    >
      <MdOutlineExitToApp size={40} />
    </button>
  )
}
