import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Grid,
  Target,
  Receipt,
  PieChart,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/operations";
import styles from "./Layout.module.css";
import toast from "react-hot-toast";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        console.log("Успешный выход из системы");
        navigate("/signin");
      })
      .catch((err) => {
        console.error("Ошибка при выходе из системы:", err);
        toast.error("Ошибка при выходе из системы");
        navigate("/signin");
      });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <NavLink to="/home" className={styles.navLink}>
          <Grid /> Главная
        </NavLink>
        <NavLink to="/goals" className={styles.navLink}>
          <Target /> Цели
        </NavLink>
        <NavLink to="/transactions" className={styles.navLink}>
          <Receipt /> Транзакции
        </NavLink>
        <NavLink to="/analytics" className={styles.navLink}>
          <PieChart /> Аналитика
        </NavLink>
        <NavLink to="/settings" className={styles.navLink}>
          <SettingsIcon /> Настройки
        </NavLink>
        <button
          onClick={handleLogout}
          className={`${styles.navLink} ${styles.logoutButton}`}
        >
          <LogOut /> Выход
        </button>
      </nav>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
