import Button from "../../../../components/Buttons/Button/Button";
import css from "./Main.module.css";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className={css.landing}>
      <main className={css.mainContent}>
        <div className={css.hero}>
          <h2 className={css.heroTitle}>Керуйте своїми фінансами ефективно</h2>
          <p className={css.heroDescription}>
            Finance Manager допоможе вам відстежувати доходи та витрати,
            створювати бюджети та досягати фінансових цілей за допомогою зручних
            інструментів аналітики.
          </p>
          <div className={css.buttonContainer}>
            <Button
              variant="primary"
              size="large"
              //   onClick={() => navigate("/home")}
              className={css.ctaButton}
            >
              Почати користуватися
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className={css.features}>
          <div className={css.featureCard}>
            <h3 className={css.featureTitle}>Облік витрат</h3>
            <p className={css.featureDescription}>
              Відстежуйте усі ваші витрати за категоріями та отримуйте докладну
              статистику
            </p>
          </div>
          <div className={css.featureCard}>
            <h3 className={css.featureTitle}>Планування бюджету</h3>
            <p className={css.featureDescription}>
              Створюйте гнучкі бюджети та стежте за їх виконанням
            </p>
          </div>
          <div className={css.featureCard}>
            <h3 className={css.featureTitle}>Финансовая аналитика</h3>
            <p className={css.featureDescription}>
              Отримуйте детальні звіти та графіки з ваших фінансів
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
