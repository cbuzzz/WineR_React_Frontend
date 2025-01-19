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
import ExperienceDetailsWL from './pages/WineLover/experiencedetails';
import ExperienceDetailsWM from './pages/WineMaker/experiencedetails';
import Booking from './pages/WineLover/booking';
import Search from './pages/WineLover/search';
import ProfileWL from './pages/WineLover/profileWineLover';
import ProfileWM from './pages/WineMaker/profileWineMaker';
import CreateExperience from './pages/WineMaker/createExperience';
import CreateWine from './pages/WineMaker/createWine';
import Friends from './pages/WineLover/friends';
import TyC from './pages/tyc';
import ChatsWL from './pages/WineLover/chats';
import ChatsWM from './pages/WineMaker/chats';
import ChatWL from './pages/WineLover/chat';
import ChatWM from './pages/WineMaker/chat';
import FriendProfile from './pages/WineLover/friendProfile';
import ListWines from './pages/WineLover/listWines';
import ListWinesWM from './pages/WineMaker/listWines';
import ManageExpWM from './pages/WineMaker/manageExperience';
import QuizPage from './pages/quizPage';
import ResultPage from './pages/resultPage';
import { TimerProvider } from './components/timercontext';
import { BadWordsProvider } from './utils/badWordsContext'; // Importa el contexto

const App: React.FC = () => {
  return (
    <Router>
      <BadWordsProvider> {/* Envolvemos toda la aplicación */}
        <TimerProvider>
          <Routes>
            {/* Rutas sin BaseLayout */}
            <Route path="/" element={<Welcome />} />
            <Route path="/loginWineLover" element={<LoginWL />} />
            <Route path="/signupWineLover" element={<SignUpWL />} />
            <Route path="/loginWineMaker" element={<LoginWM />} />
            <Route path="/signupWineMaker" element={<SignUpWM />} />
            <Route path="/tyc" element={<TyC />} />
            <Route path="/quizPage" element={<QuizPage />} />
            <Route path="/resultPage" element={<ResultPage />} />



            {/* Rutas específicas para WineLover */}
            <Route path="/homeWineLover" element={<HomeWL />} />
            <Route path="/experienceWL/:id" element={<ExperienceDetailsWL />} />
            <Route path="/search" element={<Search />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profileWineLover" element={<ProfileWL />} />
            <Route path="/chatsWL" element={<ChatsWL />} />
            <Route path="/chatWL/:roomName" element={<ChatWL />} />
            <Route path="/profile/:friendUsername" element={<FriendProfile />} />
            <Route path="/listWines" element={<ListWines />} />

            {/* Rutas específicas para WineMaker */}
            <Route path="/homeWineMaker" element={<HomeWM />} />
            <Route path="/createExperience" element={<CreateExperience />} /> {/* Ruta para crear experiencia */}
            <Route path="/createWine" element={<CreateWine />} /> {/* Ruta para crear experiencia */}
            <Route path="/profileWineMaker" element={<ProfileWM />} />
            <Route path="/experienceWM/:id" element={<ExperienceDetailsWM />} />
            <Route path="/chatsWM" element={<ChatsWM />} />
            <Route path="/chatWM/:roomName" element={<ChatWM />} />
            <Route path="/listWinesWM" element={<ListWinesWM />} />
            <Route path="/manageExpWM/:id" element={<ManageExpWM />} />

          </Routes>
        </TimerProvider>
      </BadWordsProvider>
    </Router>
  );
};

export default App;
