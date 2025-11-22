
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Notifications from './pages/Notifications'



function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/products' element={<Products/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/notifications' element={<Notifications/>}/>
    </Routes>
  )
}

export default App
