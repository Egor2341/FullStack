import styles from "./style.module.css"
import { useEffect, useState } from "react"
import { Title } from "../../components/title_navigate"
import infoService from "../../api/infoService"

export const InfoPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [rates, setRates] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await infoService.getExchange()
      setRates(res.rates)
      setErrorLabel("")
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
        <Title title={"Курсы валют"} />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.info}>
            <div className={styles.scroll}>
              {Object.entries(rates).map(([currency, value]) => (
                <div key={currency}>
                  {currency}: {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
