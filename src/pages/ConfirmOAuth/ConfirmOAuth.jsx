import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./ConfirmOAuth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading } from "../../redux/auth/selectors";
import { useCallback, useEffect, useRef, useState } from "react";
import { loginWithGoogle } from "../../redux/auth/operations";
import toast from "react-hot-toast";

const ConfirmOAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);

  const toastShownRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(true);

  const handleSuccess = useCallback(() => {
    if (!toastShownRef.current) {
      toastShownRef.current = true;
      toast.success("Успішний вход");
      navigate("/home");
    }
  }, [navigate]);

  const handleError = useCallback(() => {
    if (!toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("Помилка входу");
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const confirmOAuth = async () => {
      if (toastShownRef.current) return;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (!code) {
          throw new Error("No code provided");
        }
        setIsProcessing(true);
        const result = await dispatch(loginWithGoogle(code)).unwrap();
        if (result.token) {
          handleSuccess();
        } else {
          handleError();
        }
      } catch (error) {
        console.error("OAuth Error:", error);
        handleError();
      } finally {
        setIsProcessing(false);
      }
    };

    confirmOAuth();
  }, [dispatch, handleSuccess, handleError]);

  if (isLoading || isProcessing) {
    return (
      <>
        <div className={styles.overlay}></div>
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return null;
};
export default ConfirmOAuth;
