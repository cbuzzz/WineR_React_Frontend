import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome';
import BaseLayout from './components/baselayout';
import HomeWL from './pages/WineLover/homeWineLover';
import LoginWL from './pages/WineLover/loginWineLover';
import SignUpWL from './pages/WineLover/signupWineLover';
import HomeWM from './pages/WineMaker/homeWineMaker';
import LoginWM from './pages/WineMaker/loginWineMaker';
import SignUpWM from './pages/WineMaker/signupWineMaker';
import ExperienceDetails from './pages/experiencedetails';
import Booking from './pages/booking';
import Search from './pages/search';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas sin BaseLayout */}
        <Route path="/" element={<Welcome />} />
        <Route path="/loginWineLover" element={<LoginWL />} />
        <Route path="/signupWineLover" element={<SignUpWL />} />
        <Route path="/loginWineMaker" element={<LoginWM />} />
        <Route path="/signupWineMaker" element={<SignUpWM />} />

        {/* Rutas con BaseLayout */}
        <Route
          path="/*"
          element={
            <BaseLayout>
              <Routes>
                {/* Rutas específicas para WineLover */}
                <Route path="/homeWineLover" element={<HomeWL />} />

                {/* Rutas específicas para WineMaker */}
                <Route path="/homeWineMaker" element={<HomeWM />} />

                {/* Rutas generales dentro del BaseLayout */}
                <Route path="/experience/:id" element={<ExperienceDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/booking" element={<Booking />} />
              </Routes>
            </BaseLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

