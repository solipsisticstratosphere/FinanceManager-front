import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";

const PasswordInput = ({ field, isVisible, toggleVisibility, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <input
        {...field}
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${styles.input} ${styles.passwordInput}`}
      />
      <button
        type="button"
        className={styles.eyeIcon}
        onClick={toggleVisibility}
      >
        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignIn = location.pathname === "/signin";

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    ...(isSignIn ? {} : { confirmPassword: "" }),
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Неверный формат email")
      .required("Email обязателен"),
    password: Yup.string()
      .min(6, "Минимум 6 символов")
      .required("Пароль обязателен"),
    ...(isSignIn
      ? {}
      : {
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
            .required("Подтверждение пароля обязательно"),
        }),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isSignIn ? "Вход в аккаунт" : "Регистрация"}
          </h2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.inputGroup}>
                <Field
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="Email"
                />
                {errors.email && touched.email && (
                  <div className={styles.error}>{errors.email}</div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <Field name="password">
                  {({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder="Пароль"
                      isVisible={passwordVisible}
                      toggleVisibility={() =>
                        setPasswordVisible(!passwordVisible)
                      }
                    />
                  )}
                </Field>
                {errors.password && touched.password && (
                  <div className={styles.error}>{errors.password}</div>
                )}
              </div>

              {!isSignIn && (
                <div className={styles.inputGroup}>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Подтвердите пароль"
                        isVisible={confirmPasswordVisible}
                        toggleVisibility={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                      />
                    )}
                  </Field>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className={styles.error}>{errors.confirmPassword}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                {isSignIn ? "Войти" : "Зарегистрироваться"}
              </button>
            </Form>
          )}
        </Formik>

        <Link
          to={isSignIn ? "/signup" : "/signin"}
          className={styles.switchLink}
        >
          {isSignIn
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Войдите"}
        </Link>
      </div>
    </div>
  );
};

export default Auth;
