import React, { createContext, useEffect, useState, useRef } from 'react';
import '../styles/timer.css';

interface TimerContextProps {
    startTimer: () => void;
    stopTimer: () => void;
}

export const TimerContext = createContext<TimerContextProps | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timer, setTimer] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>(''); // Mensaje del popup
    const intervalId = useRef<NodeJS.Timeout | null>(null);
    const intervals = [1, 5, 10, 15, 30]; // Intervalos definidos

    useEffect(() => {
        // Mostrar popup cuando el temporizador alcanza un intervalo definido
        if (intervals.includes(timer)) {
            setPopupMessage(`You have been using the app for ${timer} minutes. Consider taking a break!`);
            setShowPopup(true);
        }
    }, [timer]);

    const startTimer = () => {
        if (!intervalId.current) {
            intervalId.current = setInterval(() => {
                setTimer((prev) => prev + 1); // Incrementa el temporizador
            }, 60000); // Cada minuto
        }
    };

    const stopTimer = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current); // Limpia el intervalo
            intervalId.current = null;
        }
        setTimer(0); // Reinicia el temporizador
        setShowPopup(false); // Cierra el popup si está activo
    };

    const closePopup = () => setShowPopup(false); // Cierra el popup

    return (
        <TimerContext.Provider value={{ startTimer, stopTimer }}>
            {children}

            {/* Modal Popup */}
            {showPopup && (
                <div className="modal-timer">
                    <div className="modal-content-timer">
                        <h3 className="label-timer">Take a Break</h3>
                        <p className="message-timer">{popupMessage}</p>
                        <button className="button-timer" onClick={closePopup}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </TimerContext.Provider>
    );
};
