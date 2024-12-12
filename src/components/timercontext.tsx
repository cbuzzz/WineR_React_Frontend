import React, { createContext, useEffect, useState } from 'react';
import '../styles/timer.css';

interface TimerContextProps {
    startTimer: () => void;
}

export const TimerContext = createContext<TimerContextProps | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timer, setTimer] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>(''); // Mensaje del popup

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);

                if ([1, 5, 10, 15, 30].includes(timer)) {
                    setPopupMessage(`You have been using the app for ${timer} minutes. Consider taking a break!`);
                    setShowPopup(true);
                }
            }, 60000); // Ejecuta cada minuto
        }

        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [timer]);

    const startTimer = () => setTimer(1);

    const closePopup = () => setShowPopup(false); // Cierra el popup

    return (
        <TimerContext.Provider value={{ startTimer }}>
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
