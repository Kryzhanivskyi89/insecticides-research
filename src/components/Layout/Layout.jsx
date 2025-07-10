
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const Layout = () => {
  return (
    <div className="App-header">
      <NavBar/>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;