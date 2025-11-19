
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import styles from "./styles.module.css";

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <NavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2025 Agro-BioTech Laboratory System. Усі права захищені.</p>
      </footer>
    </div>
  );
};

export default Layout;
