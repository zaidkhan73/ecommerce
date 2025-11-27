import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForwordPassword";
import HomePage from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductViewPage from "./pages/ProductView";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";

export const serverUrl = "http://localhost:8000";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductViewPage/>
           </ProtectedRoute>
           
          }
        />

        <Route
          path="/cart"
          element={
             <ProtectedRoute>
               <CartPage/>
             </ProtectedRoute>
            
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
               <CheckoutPage/>
             </ProtectedRoute>
           
          }
        />
      </Routes>
      
    </AuthProvider>
  );
}

export default App;
