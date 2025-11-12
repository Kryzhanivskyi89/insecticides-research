import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./styles.module.css";
import { logout } from "../../redux/auth/authSlice"; 

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard">📋 Дашборд</Link></li>
          <li><Link to="/new-act">➕ Новий акт</Link></li>
          <li><Link to="/search">🔍 Пошук</Link></li>
          <li>
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
              🚪 Вийти
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;