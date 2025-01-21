// PublicLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import css from "./PublicLayout.module.css";
import Button from "../Buttons/Button/Button";

export default function PublicLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <div className={css.container}>
          <Link to="/landing" className={css.logo}>
            Finance Manager
          </Link>
          <div className={css.actions}>
            <Button
              variant="text"
              onClick={() => navigate("/signin")}
              className={css.signInButton}
            >
              Увійти
            </Button>
            <Button variant="primary" onClick={() => navigate("/signup")}>
              Зареєструватися
            </Button>
          </div>
        </div>
      </header>
      <main className={css.main}>
        <Outlet />
      </main>
    </div>
  );
}
