import { Exit } from "./exit"
import { Main } from "./main"
import styles from "./title.module.css"
interface TitleProps {
  title: string;
}

export const Title = ({ title }: TitleProps) => {
    return (
      <div className={styles.container}>
        <h1>{title}</h1>
        <Main />
        <Exit />
      </div>
    )
}