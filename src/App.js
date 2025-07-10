import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginForm from "./components/LoginForm/LoginForm";
import Layout from "./components/Layout/Layout";
import ActForm from './pages/newAct/NewAct';
import Dashboard from "./pages/Dashboard/Dashboard";
// import Search from "./pages/search";
import './App.css';
import ActDetails from "./pages/ActDetails/ActDetails";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      <Route path="/" element={
          <ProtectedRoute roles={["admin", "worker", "viewer"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="act/:id" element={<ActDetails />} />
        <Route path="new-act" element={<ActForm />} />
        {/* <Route path="search" element={<Search />} /> */}
      </Route>

      <Route path="/unauthorized" element={<p>⛔ Доступ заборонено</p>} />
    </Routes>
  );
}

export default App;


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//        <ActForm/>
//       </header>
//     </div>
//   );
// }


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         {/* <Route path="dashboard" element={<Dashboard />} /> */}
//         <Route path="new-act" element={<ActForm />} />
//         {/* <Route path="search" element={<Search />} /> */}
//       </Route>
//     </Routes>
//   );
// }