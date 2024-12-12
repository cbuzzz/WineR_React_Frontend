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
import ExperienceDetails from './pages/WineLover/experiencedetails';
import Booking from './pages/WineLover/booking';
import Search from './pages/WineLover/search';
import ProfileWL from './pages/WineLover/profileWineLover';
import ProfileWM from './pages/WineMaker/profileWineMaker';
import CreateExperience from './pages/WineMaker/createExperience';
import Friends from './pages/WineLover/friends';

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

        {/* Rutas específicas para WineLover */}
        <Route path="/homeWineLover" element={<HomeWL />} />
        <Route path="/experience/:id" element={<ExperienceDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profileWineLover" element={<ProfileWL />} />

        {/* Rutas específicas para WineMaker */}
        <Route path="/homeWineMaker" element={<HomeWM />} />
        <Route path="/createExperience" element={<CreateExperience />} /> {/* Ruta para crear experiencia */}
        <Route path="/profileWineMaker" element={<ProfileWM />} />
      </Routes>
    </Router>
  );
};

export default App;
