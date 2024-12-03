import React from 'react';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
    <div className="custom-checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>{label}</span>
    </div>
);

export default Checkbox;
