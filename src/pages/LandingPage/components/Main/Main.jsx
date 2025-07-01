"use client";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Button from "../../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import css from "./Main.module.css";

import screenshot1 from "../../../../assets/pics/photo_2025-02-01_15-01-32.jpg";
import screenshot2 from "../../../../assets/pics/photo_2025-02-01_15-04-17.jpg";
import screenshot3 from "../../../../assets/pics/photo_2025-02-01_15-09-56.jpg";
import screenshot4 from "../../../../assets/pics/photo_2025-02-01_15-23-24.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const NavigationOverlay = () => {
  const swiper = useSwiper();

  return (
    <div className={css.navigationOverlay}>
      <div
        className={css.navLeft}
        onClick={() => swiper.slidePrev()}
        aria-label="Previous slide"
      />
      <div
        className={css.navRight}
        onClick={() => swiper.slideNext()}
        aria-label="Next slide"
      />
    </div>
  );
};

export default function Main() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const screenshots = [screenshot1, screenshot2, screenshot3, screenshot4];

  return (
    <div className={css.landing}>
      <div className={css.backgroundDecoration}></div>
      <div className={css.container}>
        <div className={css.content}>
          {/* Left Content Section */}
          <div className={css.leftSection}>
            <div className={css.hero}>
              <h2 className={css.heroTitle}>
                Керуйте своїми фінансами ефективно
              </h2>
              <p className={css.heroDescription}>
                Finance Manager допоможе вам відстежувати доходи та витрати,
                створювати бюджети та досягати фінансових цілей за допомогою
                зручних інструментів аналітики.
              </p>
              <div className={css.buttonContainer}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate("/signin")}
                  className={css.ctaButton}
                >
                  Почати користуватися
                </Button>
                {/* <Button
                  variant="outline"
                  size="large"
                  onClick={() => navigate("/demo")}
                  className={css.secondaryButton}
                >
                  Переглянути демо
                </Button> */}
              </div>

              <div className={css.trustBadges}>
                <div className={css.trustItem}>
                  <div className={css.trustIcon}>👥</div>
                  <div className={css.trustText}>10,000+ користувачів</div>
                </div>
                <div className={css.trustItem}>
                  <div className={css.trustIcon}>⭐</div>
                  <div className={css.trustText}>4.8/5 рейтинг</div>
                </div>
              </div>
            </div>

            <div className={css.features}>
              <div className={css.featureCard}>
                <div className={css.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={css.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className={css.featureContent}>
                  <h3 className={css.featureTitle}>Облік витрат</h3>
                  <p className={css.featureDescription}>
                    Відстежуйте усі ваші витрати за категоріями та отримуйте
                    докладну статистику. Аналізуйте свої фінансові звички та
                    оптимізуйте бюджет.
                  </p>
                </div>
              </div>

              <div className={css.featureCard}>
                <div className={css.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={css.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className={css.featureContent}>
                  <h3 className={css.featureTitle}>Планування бюджету</h3>
                  <p className={css.featureDescription}>
                    Створюйте гнучкі бюджети та стежте за їх виконанням.
                    Встановлюйте цілі та отримуйте сповіщення про їх досягнення.
                  </p>
                </div>
              </div>

              <div className={css.featureCard}>
                <div className={css.featureIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={css.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div className={css.featureContent}>
                  <h3 className={css.featureTitle}>Фінансова аналітика</h3>
                  <p className={css.featureDescription}>
                    Отримуйте детальні звіти та графіки з ваших фінансів.
                    Розумійте свої витрати та приймайте обґрунтовані рішення.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Slider Section */}
          <div className={css.rightSection}>
            <div className={css.deviceFrame}>
              <Swiper
                ref={swiperRef}
                modules={[Pagination, Autoplay, EffectFade]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                effect="fade"
                loop={true}
                spaceBetween={0}
                slidesPerView={1}
                className={css.swiper}
              >
                {screenshots.map((screenshot, index) => (
                  <SwiperSlide key={index} className={css.swiperSlide}>
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`Screenshot ${index + 1}`}
                      className={css.slideImage}
                    />
                  </SwiperSlide>
                ))}
                <NavigationOverlay />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
