
import React from 'react';

interface ResultDisplayProps {
    result: string | null;
    steps: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, steps }) => {
    if (!result && !steps) {
        return null;
    }

    return (
        <div className="mt-8 w-full animate-fade-in space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">Resultado</h3>
                <div className="bg-white p-4 rounded-lg shadow-inner text-center">
                    <p className="text-2xl md:text-3xl font-bold text-brand-primary tracking-wider">{result}</p>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">Paso a Paso</h3>
                <div className="bg-white p-4 rounded-lg shadow-inner">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">{steps}</pre>
                </div>
            </div>
        </div>
    );
};
