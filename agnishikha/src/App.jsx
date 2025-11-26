import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForwordPassword";
import HomePage from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductViewPage from "./pages/ProductView";

export const serverUrl = "http://localhost:8000";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home"
          element={
            // <ProtectedRoute>
            //   <HomePage />
            // </ProtectedRoute>
            <HomePage/>
          }
        />
        <Route
          path="/product/:id"
          element={
            // <ProtectedRoute>
            //   <HomePage />
            // </ProtectedRoute>
            <ProductViewPage/>
          }
        />
      </Routes>
      
    </AuthProvider>
  );
}

export default App;
