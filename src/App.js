import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import AuthPage from './pages/auth/AuthPage';
import Layout from "./components/Layout/Layout";
import ActForm from './pages/newAct/NewAct';
import Dashboard from "./pages/Dashboard/Dashboard";
import Search from "./pages/search/Search";
import ActDetails from "./pages/ActDetails/ActDetails";
import './App.css';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route path="/" element={
          <ProtectedRoute roles={["admin", "worker", "viewer"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="act/:id" element={<ActDetails />} />
        <Route path="new-act" element={<ActForm />} />
        <Route path="search" element={<Search />} />
      </Route>

      <Route path="/unauthorized" element={<p>⛔ Доступ заборонено</p>} />
    </Routes>
  );
}

export default App;
