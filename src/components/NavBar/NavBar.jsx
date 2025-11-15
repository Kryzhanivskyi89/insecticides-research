import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles.module.css";
import { logout } from "../../redux/auth/authSlice"; 

const NavBar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    dispatch(logout());
    navigate("/login");
  };

  const getUserInfo = () => {
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const userInfo = getUserInfo();
  const userEmail = userInfo?.email || userInfo?.sub || userInfo?.username || 'Користувач: ';
  const roleDisplay = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';


  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>🔬 AgroLabTest</h1>
          <p className={styles.tagline}>Система управління експериментами</p>
        </div>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link className={styles.navLink} to="/dashboard">
              <span className={styles.icon}>📋</span>
              <span>Дашборд</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/new-act" className={styles.navLink}>
              <span className={styles.icon}>➕</span>
              <span>Новий акт</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/search" className={styles.navLink}>
              <span className={styles.icon}>🔍</span>
              <span>Пошук</span>
            </Link>
          </li>
        </ul>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>👤</span>
            <div className={styles.userDetails}>
              <span className={styles.userEmail}>{userEmail}</span>
              {roleDisplay && <span className={styles.userRole}>{roleDisplay}</span>}
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className={styles.logoutBtn}
            title="Вийти з системи"
          >
            <span className={styles.icon}>🚪</span>
            <span>Вийти</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;