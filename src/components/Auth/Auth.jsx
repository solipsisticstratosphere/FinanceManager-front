import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { logIn, register } from "../../redux/auth/operations";
import axios from "axios";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

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
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios.get("/auth/get-oauth-url");
      const url = response.data?.data.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Помилка входу");
      }
    } catch (error) {
      toast.error("Помилка входу");
    }
  };

  const initialValues = {
    email: "",
    password: "",
    ...(isSignIn ? {} : { confirmPassword: "" }),
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Невiрний формат email")
      .required("Емейл є обов'язковим"),
    password: Yup.string()
      .min(6, "Мiнiмум 6 символiв")
      .required("Пароль є обов'язковим"),
    ...(isSignIn
      ? {}
      : {
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Паролі повинні співпадати")
            .required("Підтвердження паролю є обов'язковим"),
        }),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      if (isSignIn) {
        await dispatch(
          logIn({
            email: values.email,
            password: values.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          register({
            email: values.email,
            password: values.password,
          })
        ).unwrap();
      }
    } catch (error) {
      if (error.message) {
        setFieldError("email", error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isSignIn ? "Увiйти до аккаунту" : "Реєстрація"}
          </h2>
        </div>

        <button onClick={handleGoogleSignIn} className={styles.googleButton}>
          <GoogleIcon />
          <span>Продовжити з Google</span>
        </button>

        <div className={styles.divider}>
          <span>або</span>
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
                  placeholder="Емейл"
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
                        placeholder="Підтвердіть пароль"
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
                {isSignIn ? "Увiйти" : "Зареєструватися"}
              </button>
            </Form>
          )}
        </Formik>

        <Link
          to={isSignIn ? "/signup" : "/signin"}
          className={styles.switchLink}
        >
          {isSignIn
            ? "Немає аккаунту? Зареєструйтеся"
            : "Вже є аккаунт? Увiйти"}
        </Link>
      </div>
    </div>
  );
};

export default Auth;
