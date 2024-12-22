import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './SignUp.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';
import showPasswordIcon from '../../assets/icons/show-password-icon.png'; // Đường dẫn icon hiện mật khẩu
import hidePasswordIcon from '../../assets/icons/hide-password-icon.png'; // Đường dẫn icon ẩn mật khẩu

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle cho password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle cho confirmPassword
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const evaluatePasswordStrength = (password) => {
    if (!password) return ''; // Không hiển thị nếu mật khẩu rỗng

    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[@$!%*?&#]/.test(password);

    if (password.length < 6 || (!hasLetters || !hasNumbers)) {
      return 'weak';
    }

    if (password.length >= 6 && hasLetters && hasNumbers) {
      if (hasUppercase || hasSpecialChar) {
        return 'strong';
      }
      return 'medium';
    }

    return 'weak';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(evaluatePasswordStrength(newPassword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regular expression to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Email không hợp lệ!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Mật khẩu không khớp!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Đăng ký thành công!',
      text: 'Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login');
    });
  };

  return (
    <div
      className={styles.signUpContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.signUpBox}>
        <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">
              Mật khẩu <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? hidePasswordIcon : showPasswordIcon}
                  alt={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className={styles.passwordIcon}
                />
              </span>
            </div>
            {password && (
              <div className={styles.passwordStrength}>
                <div
                  className={`${styles.strengthBar} ${
                    passwordStrength === 'weak'
                      ? styles.weak
                      : passwordStrength === 'medium'
                      ? styles.medium
                      : styles.strong
                  }`}
                ></div>
                <p className={styles.strengthText}>
                  {passwordStrength === 'weak'
                    ? 'Độ bảo mật: Yếu'
                    : passwordStrength === 'medium'
                    ? 'Độ bảo mật: Trung bình'
                    : 'Độ bảo mật: Mạnh'}
                </p>
              </div>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">
              Xác nhận mật khẩu <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <img
                  src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
                  alt={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className={styles.passwordIcon}
                />
              </span>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Đăng Ký
          </button>
        </form>
        <button
          className={styles.goBackButton}
          onClick={() => navigate('/login')}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

export default SignUp;