import styles from "./style.module.css"
import { useEffect, useState } from "react"
import { MdDelete } from "react-icons/md"
import { type Receipt } from "../../types/receipt"
import receiptService from "../../api/receiptService"
import { Exit } from "../../components/exit"
import { PaginationButtons } from "../../components/pagination"
import axios from "axios"
import { Title } from "../../components/title_navigate"

export const ReceiptsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [errorLabel, setErrorLabel] = useState<string>("")
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const update = async (page: number) => {
    setErrorLabel("")
    try {
      setReceipts((await receiptService.getReceipts(page)).receipts)
    } catch (err) {
      console.log("Error:", err)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await receiptService.getInit()
      setReceipts(res.receipts)
      setCount(res.count)
    } catch (err) {
      setError("Не удалось загрузить страницу")
      console.log("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      await receiptService.addReceipt(formData)
    } catch (error) {
      setError("Не удалось загрузить изображение")
      console.log("Error:", error)
    }
  }

  const handleDelete = async (uuid: string) => {
    try {
      await receiptService.deleteReceipt(uuid)
      setCount(count - 1)
    } catch (err) {
      setErrorLabel("Ошибка при попытке удалить")
      console.log("Error:", err)
    }
  }

  const handleDownload = async (uuid: string) => {
    try {
      const imageUrl = await receiptService.getDownloadUrl(uuid)
      const fileResponse = await axios.get(imageUrl, {
        responseType: "blob",
      })

      const blob = new Blob([fileResponse.data])

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "image.jpg" // можно задать имя
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
      setCount(count + 1)
    } catch (error) {
      setErrorLabel("Ошибка при попытке загрузить изображение")
      console.log("Error:", error)
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
        <Title title={"Чеки"} />
        <div style={{ color: "red" }}>{errorLabel}</div>
        <div className={styles.main}>
          <div className={styles.info}>
            <input type="file" accept="image/*" onChange={handleChange} />
            <button onClick={() => handleUpload().then(() => update(page))}>Загрузить</button>
            <div className={styles.scroll}>
              {receipts.map((item, index) => (
                <div key={index} className={styles.category}>
                  <h1>{item.name}</h1>
                  <button
                    className={styles.category_button}
                    onClick={() =>
                      handleDownload(item.uuid).then(() => {
                        update(page)
                      })
                    }
                  >
                    Скачать
                  </button>
                  <button
                    className={styles.category_button}
                    onClick={() => handleDelete(item.uuid).then(() => update(page))}
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              ))}
              <PaginationButtons
                lb={() => {
                  if (page > 0) {
                    setPage(page - 1)
                    update(page - 1).then(() => setErrorLabel(" "))
                  }
                }}
                rb={() => {
                  if (page < Math.ceil(count / 10) - 1) {
                    setPage(page + 1)
                    update(page + 1).then(() => setErrorLabel(" "))
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
