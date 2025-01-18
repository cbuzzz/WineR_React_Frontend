import React, { createContext, useContext, ReactNode } from 'react';

// Lista de malas palabras para filtrarlas
const badWordsList = [
  'puta', 'perro', 'mierda', 'hala madrid', 'puta barça',
  'coño', 'gilipollas', 'cabrón', 'joder', 'puta madre', 
  'imbécil', 'idiota', 'zorra', 'cabrona', 'pendejo', 
  'tonto', 'estúpido', 'mierda', 'asqueroso', 'hijo de puta', 
  'malnacido', 'puta vida', 'puta mierda', 'follón', 'sucia', 
  'cabrón', 'cerdo', 'putón', 'polla', 'follar', 
  'chulo', 'mierdero', 'bastardo', 'vago', 'pendeja',
  'tarado', 'peluca', 'cabrona', 'flor de culo', 'cagona',
  'reventado', 'mierdoso', 'jodido', 'de mierda', 'puta vida',
  'te voy a matar', 'mataría', 'criminal', 'violador', 'puta madre',
  'mierda puta', 'cuidado con el culo', 'maricón', 'tonto el culo',
  'zorrón', 'puta loca', 'pene', 'culo', 
  'cojone', 'cagón', 'muerto', 'perra', 'mujer de mierda', 
  'concha', 'suicidio', 'delincuente', 'hipócrita', 'estúpida',
  'bobo', 'putón', 'macho alfa', 'niño de puta', 'asqueroso', 'asquerosa'
];

// Crear el contexto
interface BadWordsContextType {
  cleanText: (text: string) => string;
  containsBadWords: (text: string) => boolean;
}

// Definir el contexto con un valor por defecto
const BadWordsContext = createContext<BadWordsContextType>({
  cleanText: (text) => text,  // Inicialización de cleanText
  containsBadWords: (text) => false,  // Inicialización de containsBadWords
});

// Tipo para los props de BadWordsProvider
interface BadWordsProviderProps {
  children: ReactNode;  // Asegúrate de que children esté correctamente tipado
}

export const BadWordsProvider: React.FC<BadWordsProviderProps> = ({ children }) => {
  // Función para limpiar el texto, reemplazando las malas palabras
  const cleanText = (text: string) => {
    let cleanedText = text;
    badWordsList.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleanedText = cleanedText.replace(regex, '***');
    });
    return cleanedText;
  };

  // Función para verificar si el texto contiene malas palabras
  const containsBadWords = (text: string) => {
    return badWordsList.some((word) => new RegExp(`\\b${word}\\b`, 'gi').test(text));
  };

  return (
    <BadWordsContext.Provider value={{ cleanText, containsBadWords }}>
      {children}  {/* Aquí renderizas los hijos */}
    </BadWordsContext.Provider>
  );
};

// Exportar el hook personalizado para usar el contexto
export const useBadWords = () => useContext(BadWordsContext);
