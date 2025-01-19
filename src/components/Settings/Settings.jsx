import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSettings } from "../../redux/auth/operations";
import styles from "./Settings.module.css";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currency: "UAH",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "Пароль должен быть не менее 6 символов";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updateData = {
      name: formData.name,
      email: formData.email,
      currency: formData.currency,
    };

    if (formData.currentPassword && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    setIsLoading(true);
    try {
      await dispatch(updateUserSettings(updateData)).unwrap();
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Настройки профиля</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Имя</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Текущий пароль</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Новый пароль</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.newPassword && (
              <p className={styles.error}>{errors.newPassword}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Подтвердите новый пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Валюта</label>
            <select
              value={formData.currency}
              onChange={handleChange}
              name="currency"
              className={styles.select}
            >
              <option value="UAH">Гривна (₴)</option>
              <option value="USD">Доллар ($)</option>
              <option value="EUR">Евро (€)</option>
            </select>
          </div>

          {errors.submit && <p className={styles.error}>{errors.submit}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
