import styles from "./style.module.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { MdOutlineExitToApp } from "react-icons/md"
import type { Budget, ListBudgets, budgetType } from "../../types/budget"
import budgetService from "../../api/budgetService"
import authService from "../../api/authService"
import { Title } from "../../components/title_navigate"

export const BudgetsPage = () => {
  const monthNames = useMemo(
    () => [
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
    ],
    []
  )
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [budgets, setBudgets] = useState<ListBudgets>({ real: [], theory: [] })
  const [real, setReal] = useState<Budget[]>([])
  const [theory, setTheory] = useState<Budget[]>([])
  const [curReal, setCurReal] = useState<Budget>({
    type: "real",
    month: monthNames[new Date().getMonth()],
    year: new Date().getFullYear(),
    value: "0",
  })
  const [curTheory, setCurTheory] = useState<Budget>({
    type: "theory",
    month: monthNames[new Date().getMonth()],
    year: new Date().getFullYear(),
    value: "0",
  })
  const [searchYearReal, setSearchYearReal] = useState<number>(0)
  const [searchYearTheory, setSearchYearTheory] = useState<number>(0)
  const [isSearhReal, setSearchReal] = useState<boolean>(false)
  const [isSearhTheory, setSearchTheory] = useState<boolean>(false)
  const [isUpdate, setUpdate] = useState<boolean>(false)
  const [theoryValue, setTheoryValue] = useState<string>("")

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true)
      await budgetService
        .editBudget({
          type: "real",
          month: monthNames[new Date().getMonth()],
          year: new Date().getFullYear(),
          value: 0,
        })
        .then(async () => setBudgets(await budgetService.getBudgets()))
    } catch (err) {
      setError("Не удалось загрузить страницу")
      console.log("Error:", err)
    } finally {
      setLoading(false)
    }
  }, [monthNames])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  useEffect(() => {
    if (budgets.real.length > 0 && budgets.theory.length > 0) {
      setReal(budgets.real)
      setTheory(budgets.theory)
      setCurReal(budgets.real[0])
      setCurTheory(budgets.theory[0])
      setTheoryValue(budgets.theory[0].value)
    }
  }, [budgets])

  const search = useCallback(
    async (type: budgetType) => {
      if (type == "real") {
        setReal(
          await budgetService.getSearch(type, searchYearReal).then((v) => {
            setSearchReal(false)
            return v.budgets
          })
        )
      } else {
        setTheory(
          await budgetService.getSearch(type, searchYearTheory).then((v) => {
            setSearchTheory(false)
            return v.budgets
          })
        )
      }
    },
    [searchYearReal, searchYearTheory]
  )

  useEffect(() => {
    if (isSearhReal) {
      search("real")
    }
  }, [isSearhReal, search])

  useEffect(() => {
    if (isSearhTheory) {
      search("theory")
    }
  }, [isSearhTheory, search])

  const update = useCallback(async () => {
    setErrorLabel("")
    try {
      await budgetService
        .editBudget({
          type: "theory",
          month: monthNames[new Date().getMonth()],
          year: new Date().getFullYear(),
          value: parseFloat(theoryValue),
        })
        .then(() => setUpdate(false))
    } catch (err) {
      setErrorLabel("Не удалось изменить значение")
      console.log(err)
    }
  }, [monthNames, theoryValue])

  useEffect(() => {
    if (isUpdate) {
      update()
    }
  }, [isUpdate, update])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>
  }

  return (
    <>
      <div className={styles.page}>
        <Title title={"Бюджет"} />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.part}>
            <h2>Реальный бюджет</h2>
            <div className={styles.left_total}>
              <div className={styles.part_total}>
                <h2>{curReal.month + " " + curReal.year}</h2>
                <h2>{curReal.value}</h2>
              </div>
            </div>

            <div className={styles.year}>
              <h2>Предыдущие месяцы</h2>
              <select className={styles.list} onChange={(e) => setSearchYearReal(Number(e.target.value))}>
                <option>Год</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button className={styles.left_btn} onClick={() => setSearchReal(true)}>
                Поиск
              </button>
            </div>
            <div className={styles.scroll}>
              {real.slice(1).map((item, index) => (
                <div key={index} className={styles.category}>
                  <h2>{item.month + " " + item.year}</h2>
                  <h2>{item.value}</h2>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.part}>
            <h2>Теоретический бюджет</h2>
            <div className={styles.right_total}>
              <div className={styles.part_total}>
                <h2>{curTheory.month + " " + curTheory.year}</h2>
                <input
                  type="text"
                  value={theoryValue}
                  onChange={(e) => {
                    if (/^\d*\.?\d{0,2}$/.test(e.target.value)) {
                      setTheoryValue(e.target.value)
                    }
                  }}
                  placeholder={"0.00"}
                  className={styles.input}
                />
              </div>
              <div className={styles.part_total}>
                <h2>Редактировать</h2>
                <button className={styles.right_btn} onClick={() => setUpdate(true)}>
                  <FaEdit size={30} />
                </button>
              </div>
            </div>
            <div className={styles.year}>
              <h2>Предыдущие месяцы</h2>
              <select className={styles.list} onChange={(e) => setSearchYearTheory(Number(e.target.value))}>
                <option>Год</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button className={styles.left_btn} onClick={() => setSearchTheory(true)}>
                Поиск
              </button>
            </div>
            <div className={styles.scroll}>
              {theory.slice(1).map((item, index) => (
                <div key={index} className={styles.category}>
                  <h2>{item.month + " " + item.year}</h2>
                  <h2>{item.value}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
