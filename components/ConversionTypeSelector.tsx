
import React from 'react';
import { ConversionType } from '../types';

interface ConversionTypeSelectorProps {
    selected: ConversionType;
    onSelect: (type: ConversionType) => void;
}

const options = [
    { id: ConversionType.BINARY, label: 'Binario' },
    { id: ConversionType.OCTAL, label: 'Octal' },
    { id: ConversionType.HEX, label: 'Hexadecimal' },
];

export const ConversionTypeSelector: React.FC<ConversionTypeSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-brand-text mb-2">
                Convertir a:
            </label>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-brand-light p-1">
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        className={`w-full rounded-md py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary ${
                            selected === option.id
                                ? 'bg-brand-primary text-white shadow'
                                : 'bg-transparent text-brand-primary hover:bg-white/50'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
