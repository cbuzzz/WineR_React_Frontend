import React from 'react';
import { useNavigate } from 'react-router-dom';
import winerLogo from '../assets/winerlogot.png';
import '../styles/tyc.css';

const TermsAndConditions: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navega hacia atrás
    };

    return (
        <div className="tyc-container">
            <div className="tyc-header">
                <img src={winerLogo} alt="WineR Logo" className="tyc-logo" />
                <h1 className="label-tyc-header">Términos y Condiciones</h1>
            </div>
            <div className="tyc-content">
                <h2 className="label-tyc-section">1. Introducción</h2>
                <p className="text-tyc">
                    Bienvenido a WineR, una plataforma diseñada para conectar a entusiastas del vino ("WineLovers")
                    con propietarios de bodegas ("WineMakers"). Nuestro objetivo es ofrecer una experiencia única,
                    segura y accesible para que explores y participes en actividades enológicas alrededor del mundo.
                </p>
                <p className="text-tyc">
                    Al utilizar WineR, aceptas estar sujeto a los términos y condiciones descritos en este documento.
                    Si no estás de acuerdo con alguno de los términos, te pedimos que no utilices nuestra aplicación.
                </p>

                <h2 className="label-tyc-section">2. Definiciones</h2>
                <p className="text-tyc">
                    <strong>WineLover:</strong> Usuario registrado que utiliza la plataforma para explorar y reservar
                    experiencias ofrecidas por los WineMakers. Este perfil incluye funcionalidades como añadir amigos,
                    ver experiencias cercanas, y calificar las actividades realizadas.
                </p>
                <p className="text-tyc">
                    <strong>WineMaker:</strong> Usuario registrado que gestiona bodegas y ofrece experiencias enológicas
                    en la plataforma. Pueden crear eventos, administrar reservas y ver la lista de participantes en tiempo real.
                </p>

                <h2 className="label-tyc-section">3. Registro y Cuenta</h2>
                <p className="text-tyc">
                    El registro en WineR es obligatorio para acceder a las funcionalidades de la plataforma.
                    Al registrarte, te comprometes a proporcionar información verídica, incluyendo tu nombre,
                    correo electrónico y contraseña. Las cuentas creadas con información falsa o incompleta
                    pueden ser suspendidas sin previo aviso.
                </p>
                <p className="text-tyc">
                    <strong>Seguridad de la Cuenta:</strong> Eres responsable de mantener la confidencialidad
                    de tus credenciales de inicio de sesión. Si detectas actividad sospechosa en tu cuenta,
                    notifícanos de inmediato.
                </p>

                <h2 className="label-tyc-section">4. Funcionalidades Disponibles</h2>
                <p className="text-tyc">
                    <strong>Para WineLovers:</strong>
                    <ul className="list-tyc">
                        <li>Descubre experiencias vinícolas cercanas basadas en tu ubicación.</li>
                        <li>Reserva eventos directamente desde la plataforma.</li>
                        <li>Agrega amigos para compartir actividades y comentarios.</li>
                        <li>Califica y deja reseñas sobre las experiencias realizadas.</li>
                    </ul>
                </p>
                <p className="text-tyc">
                    <strong>Para WineMakers:</strong>
                    <ul className="list-tyc">
                        <li>Crea y promociona experiencias enológicas personalizadas.</li>
                        <li>Gestiona participantes y eventos en tiempo real.</li>
                        <li>Recibe pagos seguros a través de la plataforma.</li>
                        <li>Accede a estadísticas sobre las calificaciones de tus eventos.</li>
                    </ul>
                </p>

                <h2 className="label-tyc-section">5. Tarifas y Pagos</h2>
                <p className="text-tyc">
                    WineR aplica una tarifa de servicio del 10% sobre las reservas realizadas a través de la plataforma.
                    Esta tarifa permite mantener la aplicación operativa y brindar soporte a los usuarios.
                    Los WineMakers recibirán sus pagos en un plazo de 5 días hábiles tras finalizar la experiencia.
                </p>

                <h2 className="label-tyc-section">6. Políticas de Cancelación</h2>
                <p className="text-tyc">
                    Cada WineMaker establece sus propias políticas de cancelación, las cuales deben ser respetadas por
                    los WineLovers. En caso de no presentarse a una experiencia reservada, no se realizará ningún reembolso,
                    a menos que las políticas específicas del evento indiquen lo contrario.
                </p>

                <h2 className="label-tyc-section">7. Limitaciones de Responsabilidad</h2>
                <p className="text-tyc">
                    WineR actúa como un intermediario entre los WineLovers y los WineMakers. No nos hacemos responsables
                    por problemas como:
                    <ul className="list-tyc">
                        <li>Cancelaciones de última hora por parte del WineMaker.</li>
                        <li>Errores en la descripción de las experiencias.</li>
                        <li>Accidentes ocurridos durante las actividades.</li>
                    </ul>
                </p>

                <h2 className="label-tyc-section">8. Resolución de Conflictos</h2>
                <p className="text-tyc">
                    Si surge un conflicto entre un WineLover y un WineMaker, WineR actuará como mediador.
                    Ambas partes deberán proporcionar pruebas claras para respaldar sus reclamaciones.
                </p>

                <h2 className="label-tyc-section">9. Contacto</h2>
                <p className="text-tyc">
                    Si tienes dudas o necesitas ayuda, puedes contactarnos en <strong>support@winer.com</strong>.
                    Estamos disponibles de lunes a viernes, de 9:00 AM a 6:00 PM.
                </p>
            </div>
            <div className="tyc-footer">
                <button className="button-tyc" onClick={handleGoBack}>Volver</button>
            </div>
        </div>
    );
};

export default TermsAndConditions;
