import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavWineLover from '../../components/NavWineLover';
import '../../styles/home.css';

const Loading: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirige al usuario después de un breve tiempo
        const timer = setTimeout(() => {
            navigate('/profileWineLover');
        }, 500); // Tiempo en milisegundos (2 segundos)

        return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
    }, [navigate]);

    return (
        <NavWineLover>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold' }}>
                Loading...
            </div>
        </NavWineLover>
    );
};

export default Loading;
