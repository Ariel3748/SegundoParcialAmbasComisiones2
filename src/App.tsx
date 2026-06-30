import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Desarrolladores from './pages/Desarrolladores';
import ManageTags from './pages/ManageTags';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Error404 from './pages/Error404';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar />

            <div className="container mt-4" style={{ flex: '1 0 auto' }}>
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/desarrolladores" element={<Desarrolladores />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/create-post" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />

              <Route path="/manage-tags" element={
                <ProtectedRoute>
                  <ManageTags />
                </ProtectedRoute>
              } />

              <Route path="/edit-post/:id" element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              } />

              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;