import { useState, useEffect } from "react"
import categoryService from "../api/categoryService"

export function useCategories() {
  const [expenses, setExpenses] = useState<string[]>([])
  const [incomes, setIncomes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [eUuids, setEUuids] = useState<string[]>([])
  const [iUuids, setIUuids] = useState<string[]>([])
  const [eCount, setECount] = useState<number>(0)
  const [iCount, setICount] = useState<number>(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const categories = await categoryService.getCategories()
      if (categories.expenses.length != 0) {
        setExpenses(categories.expenses)
        setEUuids(categories.e_uuids)
        setECount(categories.e_count)
      }
      if (categories.incomes.length != 0) {
        setIncomes(categories.incomes)
        setIUuids(categories.i_uuids)
        setICount(categories.i_count)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === "string") {
        setError(err)
      } else {
        setError("Произошла ошибка при получении категорий")
      }
      console.log("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOneTypeCategories = async (type: "e" | "i", page: number, order: boolean) => {
    try {
      setLoading(true)
      const categories = await categoryService.getOneTypeCategories(type, page, order)
      if (type === "e") {
        setExpenses(categories.categories)
        setEUuids(categories.uuids)
      } else {
        setIncomes(categories.categories)
        setIUuids(categories.uuids)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === "string") {
        setError(err)
      } else {
        setError("Произошла ошибка при получении категорий")
      }
      console.log("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
