import styles from "./style.module.css"
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import type { ListItems, Item } from "../../types/item"
import itemService from "../../api/itemService"
import { PaginationButtons } from "../../components/pagination"
import { ExpensesJsonLd } from "../../components/ExpensesJsonLd"
import { Title } from "../../components/title_navigate"

export const ExpencesPage = () => {
  const [items, setItems] = useState<ListItems>({
    total: "0",
    items: [],
  })

  const [title, setTitle] = useState("")
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchResult, setSearchResult] = useState("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([""])
  const [categoryName, setCategoryName] = useState<string>("")
  const [value, setValue] = useState<string>("")
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<boolean>(true)

  const handleValue = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setValue(value)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const update = async (page: number, order: boolean) => {
    setErrorLabel("")
    try {
      setItems(await itemService.getItems("/expenses", page, order))
      setCategoryName("")
      setValue("")
    } catch (err) {
      console.log("Error:", err)
    }
  }

  const fetchSearch = async () => {
    setErrorLabel("")
    try {
      setSearchResult((await itemService.getSearch("/expenses", title, year, month)).value)
    } catch (err) {
      setErrorLabel("Поиск не удался")
      console.log("Error:", err)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setItems(await itemService.getItems("/expenses", 0, true))
      setCategories((await itemService.getCategories("/expenses")).categories)
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
      <ExpensesJsonLd item={{name: "Бензин", value: "10000"}}/>
      <div className={styles.page}>
        <Title title={"Расходы"} />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.search}>
            <h1 className={styles.text_center}>Поиск по категории</h1>

            <select className={styles.category_list} onChange={(e) => setTitle(e.target.value)}>
              <option>Выберите</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
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
            <button
              className={styles.btn}
              onClick={() => {
                fetchSearch()
              }}
            >
              Найти
            </button>
            <h2>Результат: {searchResult}</h2>
          </div>

          <div className={styles.info}>
            <div className={styles.add}>
              <select className={styles.list} value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
                <option>Выберите</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={value}
                onChange={(e) => handleValue(e.target.value)}
                placeholder="0.00"
                className={styles.input}
              />
              <button
                className={styles.btn}
                onClick={async () => {
                  if (categoryName) {
                    try {
                      await itemService.addItem("/expenses", { name: categoryName, value: value }).then(() => {
                        update(page, order)
                      })
                    } catch (err) {
                      console.log(err)
                      setErrorLabel("Ошибка при попытке добавить категорию")
                    }
                  }
                }}
              >
                Добавить
              </button>
            </div>
            <div className={styles.total}>
              <h1>Расходы за месяц</h1>
              <h1>{items.total}</h1>
            </div>
            <select
              onChange={(e) =>
                update(page, e.target.value === "По возрастанию").then(() =>
                  setOrder(e.target.value === "По возрастанию")
                )
              }
            >
              <option>Выберите</option>
              <option>По возрастанию</option>
              <option>По убыванию</option>
            </select>
            <div className={styles.scroll}>
              {items.items.map((item, index) => (
                <div key={index} className={styles.category}>
                  <h1>{item.name}</h1>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setItems({
                          total: items.total,
                          items: [
                            ...items.items.slice(0, index),
                            { name: item.name, value: e.target.value },
                            ...items.items.slice(index + 1),
                          ],
                        })
                      }
                    }}
                    placeholder={item.value}
                    className={styles.input}
                  />
                  <button
                    className={styles.category_button}
                    onClick={async () => {
                      try {
                        await itemService
                          .editItem("/expenses", {
                            name: item.name,
                            value: item.value,
                          })
                          .then(() => update(page, order))
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
                        await itemService.deleteItem("/expenses", item.name).then(() => update(page, order))
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
                  if (page > 0) {
                    setPage(page - 1)
                    update(page - 1, order).then(() => setErrorLabel(" "))
                  }
                }}
                rb={() => {
                  console.log(items)
                  if (page < Math.ceil(categories.length / 7) - 1) {
                    setPage(page + 1)
                    update(page + 1, order).then(() => setErrorLabel(" "))
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
