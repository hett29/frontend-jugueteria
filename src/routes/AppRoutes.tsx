import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import CategoryPage from "../pages/CategoryPage";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorias/:categoryId" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
