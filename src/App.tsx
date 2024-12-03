import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/welcome';
import BaseLayout from './components/baselayout';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signup';
import ExperienceDetails from './pages/experiencedetails';
import Booking from './pages/booking';
import Search from './pages/search';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas sin BaseLayout */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas con BaseLayout */}
        <Route
          path="/*"
          element={
            <BaseLayout>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/experience/:id" element={<ExperienceDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/booking/:id" element={<Booking />} />
              </Routes>
            </BaseLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
