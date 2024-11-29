import React from 'react';
import './button.css';

interface ButtonProps {
    text: string;
    onClick: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => (
    <button className="custom-button" onClick={onClick} disabled={disabled}>
        {text}
    </button>
);

export default Button;
