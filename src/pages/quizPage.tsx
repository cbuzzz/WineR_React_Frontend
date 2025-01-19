import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/quizPage.css';
import winerLogo from '../assets/winerlogot.png';


const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [

    {
      question: '¿Con qué tipo de comida acompañas el vino?',
      options: ['Carnes', 'Pescados', 'Postres', 'Quesos', 'Ensaladas', 'Mariscos'],
    },
    {
      question: '¿Qué sabor prefieres en el vino?',
      options: ['Seco', 'Afrutado', 'Dulce', 'Amargo', 'Suave', 'Equilibrado'],
    },
    {
      question: '¿Con qué frecuencia tomas vino?',
      options: ['Diario', 'Semanal', 'Mensual', 'Ocasionalmente', 'En celebraciones', 'Cuando me apetece'],
    },
    {
      question: '¿Qué tipo de vino prefieres consumir?',
      options: ['Nacionales', 'Internacionales', 'De autor', 'De bodegas grandes', 'De bodegas pequeñas'],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/resultPage', { state: { answers } });
    }
  };

  return (
    <div className="quiz-page">
        <div className="login-image">
                <img src={winerLogo} alt="WineR Logo" />
            </div>
      <h1 className="quiz-title">¡Descubre tu vino ideal!</h1>
      <div className="quiz-content">
        <p className="quiz-question">{questions[currentQuestion].question}</p>
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className="quiz-option"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
