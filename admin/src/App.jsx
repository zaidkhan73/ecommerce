import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import EditCategory from './pages/EditCategory'
import AddProduct from './pages/AddProduct'
import EditProductPage from './pages/EditProduct'
import Orders from './pages/Orders'
import ViewProduct from './pages/ViewProduct'
import ForgotPassword from './pages/ForgotPassword'

export const serverUrl = 'https://agnishikha-backend.onrender.com'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProductPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ViewProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
