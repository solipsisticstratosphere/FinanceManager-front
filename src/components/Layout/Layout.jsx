import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Grid,
  Target,
  Receipt,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/operations";
import styles from "./Layout.module.css";
import toast from "react-hot-toast";
import CalendarWidget from "../CalendarWidget/CalendarWidget";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/signin");
      })
      .catch(() => {
        toast.error("Помилка при виході з системи");
        navigate("/signin");
      });
  };

  const navigation = [
    { path: "/home", icon: <Grid size={20} />, text: "Головна" },
    { path: "/goals", icon: <Target size={20} />, text: "Цілі" },
    { path: "/transactions", icon: <Receipt size={20} />, text: "Транзакції" },
    { path: "/analytics", icon: <PieChart size={20} />, text: "Аналітика" },
    { path: "/settings", icon: <Settings size={20} />, text: "Налаштування" },
  ];

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.sidebar}>
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={styles.navLink}>
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          ))}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Вихід</span>
          </button>
        </nav>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <CalendarWidget />
    </>
  );
};

export default Layout;
