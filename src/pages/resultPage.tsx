import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/quizPage.css';
import winerLogo from '../assets/winerlogot.png';

// Función para determinar el vino recomendado
const determineWine = (answers: string[]): { wine: string, description: string } => {
  const scoringTable: Record<string, Record<'Tinto' | 'Blanco' | 'Rosado' | 'Espumoso', number>> = {
    Carnes: { Tinto: 3, Blanco: 0, Rosado: 1, Espumoso: 0 },
    Pescados: { Tinto: 0, Blanco: 3, Rosado: 1, Espumoso: 2 },
    Postres: { Tinto: 0, Blanco: 1, Rosado: 3, Espumoso: 2 },
    Quesos: { Tinto: 2, Blanco: 1, Rosado: 1, Espumoso: 3 },
    Seco: { Tinto: 3, Blanco: 2, Rosado: 1, Espumoso: 0 },
    Afrutado: { Tinto: 1, Blanco: 3, Rosado: 2, Espumoso: 1 },
    Dulce: { Tinto: 0, Blanco: 1, Rosado: 2, Espumoso: 3 },
    Diario: { Tinto: 3, Blanco: 2, Rosado: 1, Espumoso: 0 },
    Semanal: { Tinto: 2, Blanco: 3, Rosado: 1, Espumoso: 1 },
    Mensual: { Tinto: 1, Blanco: 2, Rosado: 3, Espumoso: 1 },
    Ocasionalmente: { Tinto: 0, Blanco: 1, Rosado: 2, Espumoso: 3 },
    Nacionales: { Tinto: 3, Blanco: 2, Rosado: 1, Espumoso: 1 },
    Internacionales: { Tinto: 1, Blanco: 3, Rosado: 2, Espumoso: 3 },
    Tinto: { Tinto: 5, Blanco: 0, Rosado: 0, Espumoso: 0 },
    Blanco: { Tinto: 0, Blanco: 5, Rosado: 0, Espumoso: 0 },
    Rosado: { Tinto: 0, Blanco: 0, Rosado: 5, Espumoso: 0 },
    Espumoso: { Tinto: 0, Blanco: 0, Rosado: 0, Espumoso: 5 },
  };

  const scores: Record<'Tinto' | 'Blanco' | 'Rosado' | 'Espumoso', number> = {
    Tinto: 0,
    Blanco: 0,
    Rosado: 0,
    Espumoso: 0,
  };

  answers.forEach((answer) => {
    const scoring = scoringTable[answer];
    if (scoring) {
      scores.Tinto += scoring.Tinto;
      scores.Blanco += scoring.Blanco;
      scores.Rosado += scoring.Rosado;
      scores.Espumoso += scoring.Espumoso;
    }
  });

  const recommendedWine = Object.entries(scores).reduce<[string, number]>(
    (bestWine, currentWine) =>
      currentWine[1] > bestWine[1] ? [currentWine[0], currentWine[1]] : bestWine,
    ['', 0] // Inicialización correcta del acumulador
  );

  // Descripción de cada tipo de vino
  let description = '';
  switch (recommendedWine[0]) {
    case 'Tinto':
      description = 'Vino Tinto: Se asocia con carnes rojas y platos robustos debido a su intensidad y taninos. Ejemplo: Rioja Gran Reserva.';
      break;
    case 'Blanco':
      description = 'Vino Blanco: Ideal con pescados y mariscos, debido a su frescura y acidez. Ejemplo: Albariño de Rías Baixas.';
      break;
    case 'Rosado':
      description = 'Vino Rosado: Perfecto para postres y aperitivos, con una combinación de frescura y suavidad. Ejemplo: Navarra Rosado.';
      break;
    case 'Espumoso':
      description = 'Vino Espumoso: Perfecto para celebraciones o postres, con burbujas refrescantes. Ejemplo: Cava Brut.';
      break;
    default:
      description = 'Sin preferencia clara, no se pudo determinar un vino.';
      break;
  }

  return { wine: recommendedWine[0], description };
};

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || [];

  const { wine: recommendedWine, description } = determineWine(answers);

  // Estado para el tiempo restante
  const [timeLeft, setTimeLeft] = useState(10); 

  useEffect(() => {
    // Si el tiempo es mayor que 0, se reduce cada segundo
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Redirigir cuando el tiempo llega a 0
      navigate('/loginWineLover');
    }
  }, [timeLeft, navigate]);

  return (
    <div className="result-page">
      <div className="login-image">
                <img src={winerLogo} alt="WineR Logo" />
            </div>
      <h1 className="result-title">¡Tu vino ideal es!</h1>
      <p className="result-wine">{recommendedWine}</p>
      <p className="result-description">{description}</p>
      <p className="result-timer">Serás redirigido al inicio de sesión en {timeLeft} segundos...</p>
    </div>
  );
};

export default ResultPage;
