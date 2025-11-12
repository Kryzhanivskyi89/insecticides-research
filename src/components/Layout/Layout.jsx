
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import styles from "./styles.module.css";

const Layout = () => {
  return (
    <div className="App-container">
      <NavBar/>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;