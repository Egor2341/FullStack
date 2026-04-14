import styles from "./style.module.css"
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import statService from "../../api/statService"
import type { UserInfo } from "../../types/stat"
import { Title } from "../../components/title_navigate"

export const AdminRightsPage = () => {
  const [items, setItems] = useState<UserInfo[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [isPosting, setPosting] = useState<boolean>(false)

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    if (isPosting) {
      update()
    }
  }, [isPosting])

  const update = async () => {
    setErrorLabel("")
    try {
      setItems(
        await statService.getUsers().then((v) => {
          setPosting(false)
          return v
        })
      )
    } catch (err) {
      console.log("Error:", err)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setItems(await statService.getUsers())
    } catch (err) {
      setError("Не удалось загрузить страницу")
      console.log("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>
  }

  return (
    <>
      <div className={styles.page}>
        <Title title={"Пользователи"} />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.info}>
            <div className={styles.scroll}>
              {items.map((item, index) => (
                <div key={index} className={styles.category}>
                  <h1>{item.email}</h1>
                  <h1>|</h1>
                  {item.roles.includes("admin") && <h1>Администратор</h1>}
                  <button
                    className={styles.category_button}
                    onClick={async () => {
                      try {
                        if (!item.roles.includes("admin")) {
                          await statService.addAdmin(item.email).then(() => setPosting(true))
                        }
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке добавить права")
                        console.log("Error:", err)
                      }
                    }}
                  >
                    <FaEdit size={30} />
                  </button>

                  <button
                    className={styles.category_button}
                    onClick={async () => {
                      try {
                        if (item.roles.includes("admin")) {
                          await statService.deleteAdmin(item.email).then(() => setPosting(true))
                        }
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке удалить права")
                        console.log("Error:", err)
                      }
                    }}
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
