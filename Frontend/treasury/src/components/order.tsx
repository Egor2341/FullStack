import styles from "./order.module.css"


export const Order = (action: () => void) => {
  return (
    <select
      className={styles.list}
      onChange={action}
    >
      <option>Выберите</option>
      <option>По возрастанию</option>
      <option>По убыванию</option>
    </select>
  )
}
