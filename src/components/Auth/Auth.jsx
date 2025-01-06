import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { logIn, register } from "../../redux/auth/operations";

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
