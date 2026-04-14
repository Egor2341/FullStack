import { NavLink, useNavigate } from "react-router-dom"
import { FaCoins } from "react-icons/fa"
import { RiSafe3Line } from "react-icons/ri"
import { CgLogIn } from "react-icons/cg"
import style from "./style.module.css"
import { Helmet } from "react-helmet-async"

export const WelcomePage = () => {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate("/login")
  }

  return (
    <>
      <Helmet>
        <title>Управление личными финансами</title>
        <meta property="og:title" content="Управление личными финансами" />
        <meta name="description" content={"Ведите учет расходов и доходов, сохраняйте чеки"} />
      </Helmet>
      <div className={style.leftPart}>
        <h1 className={style.header}>Сокровищница</h1>
        <span className={style.slogan}>Деньги любят счет</span>
        <div className={style.coins}>
          <span></span>
          <FaCoins color="#D97706" />
          <span></span>
        </div>
        <div className={style.welcome}>
          <div className={style.circle}>
            <RiSafe3Line color="#ffffff" />
          </div>
          <div className={style.welcomeTitle}>
            <h3>Добро пожаловать</h3>
            <span className={style.slogan}>Управляй своими богатствами</span>
          </div>
          <button className={style.login} onClick={handleButtonClick}>
            <CgLogIn color="#ffffff" />
            <span>Войти в сокровищницу</span>
          </button>
          <NavLink to="/register" className={style.register}>
            Зарегистрироваться
          </NavLink>
        </div>
      </div>
      <div className={style.rightPart}>
        <img className={style.dragon} src="/src/assets/dragon.png" alt="Черный дракон лежит на золоте" />
      </div>
    </>
  )
}
