import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("DETAILS");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState(Array(6).fill(""));

  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === "OTP" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  useEffect(() => {
    if (step === "OTP" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  async function handleRequestOTP(e) {
    if (e) e.preventDefault();
    setError(null);
    setInfoMessage("");
    setIsLoading(true);

    try {
      await api.post("/auth/register-request", {
        name,
        email,
        password,
      });

      setStep("OTP");
      setInfoMessage(`Verification code sent to ${email}`);
      setResendTimer(60);
    } catch (err) {
      console.error("Register Request Failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Failed to send verification code. Please check your details.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError(null);

    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register-verify", {
        name,
        password,
        email,
        otp: otpString,
      });

      navigate("/login");
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Invalid or expired verification code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      if (error) setError(null);
      inputRefs.current[5]?.focus();
    }
  };

  const handleEditDetails = () => {
    setStep("DETAILS");
    setOtp(Array(6).fill(""));
    setError(null);
    setInfoMessage("");
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.card}>
        {/* Card Header */}
        <div className={styles.headerGroup}>
          <h1 className={styles.title}>
            {step === "DETAILS" ? "Create an Account" : "Verify Your Email"}
          </h1>
          <p className={styles.subtitle}>
            {step === "DETAILS"
              ? "Join BlogBucket to publish your stories and connect with writers"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {infoMessage && (
          <div className={styles.infoBanner} role="status">
            <span>{infoMessage}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert">
            <span>{error}</span>
          </div>
        )}

        {step === "DETAILS" ? (
          <form className={styles.form} onSubmit={handleRequestOTP}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={name}
                required
                disabled={isLoading}
                className={styles.input}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={email}
                required
                disabled={isLoading}
                className={styles.input}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                required
                minLength={6}
                disabled={isLoading}
                className={styles.input}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !name || !email || !password}
            >
              {isLoading ? "Sending Code..." : "Continue"}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleVerifyOTP}>
            <div className={styles.otpGroup}>
              <label className={styles.label}>Enter 6-Digit Code</label>

              <div className={styles.otpContainer} onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isLoading}
                    className={styles.otpBox}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || otp.join("").length < 6}
            >
              {isLoading ? "Verifying..." : "Register"}
            </button>

            <div className={styles.otpActions}>
              <button
                type="button"
                className={styles.textBtn}
                disabled={resendTimer > 0 || isLoading}
                onClick={() => handleRequestOTP(null)}
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : "Resend OTP"}
              </button>

              <button
                type="button"
                className={styles.textBtnSecondary}
                disabled={isLoading}
                onClick={handleEditDetails}
              >
                Change Email / Details
              </button>
            </div>
          </form>
        )}

        <div className={styles.cardFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
