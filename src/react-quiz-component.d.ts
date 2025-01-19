declare module 'react-quiz-component' {
  // Definir el tipo de las preguntas (ajustar según las propiedades reales)
  export interface Question {
    question: string;
    answer: string;
    options: string[];
  }

  // Definir los props del componente Quiz
  export interface QuizProps {
    questions: Question[]; // Array de preguntas
    onFinish: () => void; // Función que se ejecuta al finalizar el quiz
    customStyles?: {       // Propiedades opcionales para estilos personalizados
      question?: string;
      option?: string;
      button?: string;
    };
  }

  // Componente Quiz
  const Quiz: React.FC<QuizProps>;

  export default Quiz;
}
