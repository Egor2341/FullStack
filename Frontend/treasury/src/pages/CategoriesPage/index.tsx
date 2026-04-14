import styles from "./style.module.css"
import { MdDelete } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import { MdOutlineExitToApp } from "react-icons/md"
import { useCategories } from "../../hooks/useCategories"
import authService from "../../api/authService"
import { useState } from "react"
import categoryService from "../../api/categoryService"
import { PaginationButtons } from "../../components/pagination"
import { Exit } from "../../components/exit"
import { Title } from "../../components/title_navigate"

export const CategoriesPage = () => {
  const {
    expenses,
    eUuids,
    eCount,
    setECount,
    setExpenses,
    incomes,
    iUuids,
    iCount,
    setICount,
    setIncomes,
    loading,
    error,
    fetchOneTypeCategories,
  } = useCategories()
  const [ecategory, setEcategory] = useState<string>("")
  const [icategory, setIcategory] = useState<string>("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [pageE, setPageE] = useState<number>(0)
  const [pageI, setPageI] = useState<number>(0)
  const [orderE, setOrderE] = useState<boolean>(true)
  const [orderI, setOrderI] = useState<boolean>(true)

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>
  }

  const addCategoryLogic = async (name: string, type: "expenses" | "incomes", page: number, order: boolean) => {
    setErrorLabel("")
    if (name) {
      try {
        await categoryService.addCategory({ name: name, type: type }).then(() => {
          setEcategory("")
          setIcategory("")
        })
        fetchOneType(type === "expenses" ? "e" : "i", page, order)
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("422")) {
            setErrorLabel("Такая категория уже есть")
          }
        } else {
          setErrorLabel("Ошибка при попытке добавить категорию")
        }
        console.log("Error:", err)
      }
    } else {
      setErrorLabel("Нельзя добавить пустое значение")
    }
  }

  const fetchOneType = async (type: "e" | "i", page: number, order: boolean) => {
    setErrorLabel("")
    try {
      fetchOneTypeCategories(type, page, order)
    } catch (err) {
      setErrorLabel("Ошибка при попытке сортировки")
      console.log("Error:", err)
    }
  }

  return (
    <>
      <div className={styles.page}>
        <Title title={"Категории"}/>
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.part}>
            <div className={styles.left_title}>
              <h1>Расходы</h1>
            </div>
            <div className={styles.add}>
              <input
                type="text"
                className={styles.input}
                value={ecategory}
                onChange={(e) => setEcategory(e.target.value)}
              />
              <button
                className={styles.left_btn}
                onClick={async () => {
                  await addCategoryLogic(ecategory, "expenses", pageE, orderE)
                  setECount(eCount + 1)
                }}
              >
                Добавить
              </button>

              <select
                className={styles.category_list}
                onChange={(e) =>
                  fetchOneType("e", pageE, e.target.value === "По возрастанию").then(() =>
                    setOrderE(e.target.value === "По возрастанию")
                  )
                }
              >
                <option>Выберите</option>
                <option>По возрастанию</option>
                <option>По убыванию</option>
              </select>
            </div>
            <div className={styles.scroll}>
              {expenses.map((category, index) => (
                <div key={index} className={styles.category}>
                  <input
                    type="text"
                    className={styles.input}
                    value={category}
                    onChange={(e) => {
                      setExpenses([...expenses.slice(0, index), e.target.value, ...expenses.slice(index + 1)])
                    }}
                  />
                  <button
                    className={styles.category_button}
                    onClick={async () => {
                      try {
                        await categoryService
                          .editCategory({
                            uuid: eUuids[index],
                            name: category,
                          })
                          .then(() => fetchOneType("e", pageE, orderE).then(() => setErrorLabel(" ")))
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке обновить категорию")
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
                        await categoryService
                          .deleteCategory(eUuids[index])
                          .then(() => fetchOneType("e", pageE, orderE).then(() => setErrorLabel(" ")))
                        setECount(eCount - 1)
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке удалить категорию")
                        console.log("Error:", err)
                      }
                    }}
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              ))}
              <PaginationButtons
                lb={() => {
                  if (pageE > 0) {
                    setPageE(pageE - 1)
                    fetchOneType("e", pageE - 1, orderE).then(() => setErrorLabel(" "))
                  }
                }}
                rb={() => {
                  if (pageE < Math.ceil(eCount / 5) - 1) {
                    setPageE(pageE + 1)
                    fetchOneType("e", pageE + 1, orderE).then(() => setErrorLabel(" "))
                  }
                }}
              />
            </div>
          </div>

          <div className={styles.part}>
            <div className={styles.right_title}>
              <h1>Доходы</h1>
            </div>
            <div className={styles.add}>
              <input
                type="text"
                className={styles.input}
                value={icategory}
                onChange={(e) => setIcategory(e.target.value)}
              />{" "}
              <button
                className={styles.right_btn}
                onClick={async () => {
                  await addCategoryLogic(icategory, "incomes", pageI, orderI)
                  setICount(iCount + 1)
                }}
              >
                Добавить
              </button>
              <select
                className={styles.category_list}
                onChange={(e) =>
                  fetchOneType("i", pageI, e.target.value === "По возрастанию").then(() =>
                    setOrderI(e.target.value === "По возрастанию")
                  )
                }
              >
                <option>Выберите</option>
                <option>По возрастанию</option>
                <option>По убыванию</option>
              </select>
            </div>
            <div className={styles.scroll}>
              {incomes.map((category, index) => (
                <div key={index} className={styles.category}>
                  <input
                    type="text"
                    className={styles.input}
                    value={category}
                    onChange={(e) => {
                      setIncomes([...incomes.slice(0, index), e.target.value, ...incomes.slice(index + 1)])
                    }}
                  />
                  <button
                    className={styles.category_button}
                    onClick={async () => {
                      try {
                        await categoryService.editCategory({
                          uuid: iUuids[index],
                          name: category,
                        })
                        fetchOneType("i", pageI, orderI).then(() => setErrorLabel(" "))
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке обновить категорию")
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
                        await categoryService.deleteCategory(iUuids[index])
                        fetchOneType("i", pageI, orderI).then(() => setErrorLabel(" "))
                        setICount(iCount - 1)
                      } catch (err) {
                        setErrorLabel("Ошибка при попытке удалить категорию")
                        console.log("Error:", err)
                      }
                    }}
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              ))}
              <PaginationButtons
                lb={() => {
                  if (pageI > 0) {
                    setPageI(pageI - 1)
                    fetchOneType("i", pageI - 1, orderI).then(() => setErrorLabel(" "))
                  }
                }}
                rb={() => {
                  if (pageI < Math.ceil(iCount / 5) - 1) {
                    setPageI(pageI + 1)
                    fetchOneType("i", pageI + 1, orderI).then(() => setErrorLabel(" "))
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
