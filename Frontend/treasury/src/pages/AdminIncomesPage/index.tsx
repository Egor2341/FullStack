import styles from "./style.module.css"
import { useCallback, useEffect, useState } from "react"
import { MdOutlineExitToApp } from "react-icons/md"
import statService from "../../api/statService"
import authService from "../../api/authService"
import { Title } from "../../components/title_navigate"

export const AdminIncomesPage = () => {
  const [year, setYear] = useState(0)
  const [infoType, setInfoType] = useState("")
  const [month, setMonth] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [isSearch, setSearch] = useState<boolean>(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchSearch = useCallback(async () => {
    setErrorLabel("")
    try {
      const res = await statService.getStat("i", infoType, year, month).then((v) => {
        setSearch(false)
        return v
      })
      setSearchResult(`Результат: ${res.value}, количество пользователей: ${res.count}`)
    } catch (err) {
      setErrorLabel("Поиск не удался")
      console.log("Error:", err)
    }
  }, [infoType, year, month])

  useEffect(() => {
    if (isSearch) {
      fetchSearch()
    }
  }, [isSearch, fetchSearch])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setSearchResult("Задайте параметры")
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
        <Title title="Доходы пользователей" />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.search}>
            <h1 className={styles.text_center}>Сумма или среднее</h1>

            <select className={styles.category_list} onChange={(e) => setInfoType(e.target.value)}>
              <option>Выберите</option>
              <option>Сумма</option>
              <option>Среднее</option>
            </select>

            <h1>Период</h1>
            <div className={styles.period}>
              <div className={styles.periodpart}>
                <select className={styles.list} onChange={(e) => setYear(Number(e.target.value))}>
                  <option>Год</option>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="selectedCategory"
                  className={styles.list}
                  onChange={(e) => {
                    setMonth(e.target.value)
                  }}
                >
                  <option>Месяц</option>
                  {[
                    "Все",
                    "Январь",
                    "Февраль",
                    "Март",
                    "Апрель",
                    "Май",
                    "Июнь",
                    "Июль",
                    "Август",
                    "Сентябрь",
                    "Октябрь",
                    "Ноябрь",
                    "Декабрь",
                  ].map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className={styles.btn} onClick={() => setSearch(true)}>
              Найти
            </button>
          </div>

          <div className={styles.info}>
            <h1>{searchResult}</h1>
          </div>
        </div>
      </div>
    </>
  )
}
