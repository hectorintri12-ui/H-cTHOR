
import React, { useState, useCallback } from 'react';
import { ConversionType } from './types';
import { getConversionSteps } from './services/geminiService';
import { ConversionTypeSelector } from './components/ConversionTypeSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { CalculatorIcon } from './components/icons/CalculatorIcon';

const App: React.FC = () => {
    const [decimalInput, setDecimalInput] = useState<string>('');
    const [conversionType, setConversionType] = useState<ConversionType>(ConversionType.BINARY);
    const [result, setResult] = useState<string | null>(null);
    const [steps, setSteps] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const performLocalConversion = (decimal: number, type: ConversionType): string => {
        switch (type) {
            case ConversionType.BINARY:
                return decimal.toString(2);
            case ConversionType.OCTAL:
                return decimal.toString(8);
            case ConversionType.HEX:
                return decimal.toString(16).toUpperCase();
            default:
                return '';
        }
    };

    const handleConvert = useCallback(async () => {
        setError(null);
        setResult(null);
        setSteps(null);

        if (!decimalInput.trim()) {
            setError('Por favor, ingrese un número decimal.');
            return;
        }

        const decimalValue = parseInt(decimalInput, 10);

        if (isNaN(decimalValue) || decimalValue < 0 || !Number.isInteger(decimalValue)) {
            setError('Por favor, ingrese un número entero no negativo.');
            return;
        }
        
        setIsLoading(true);

        try {
            const localResult = performLocalConversion(decimalValue, conversionType);
            const explanation = await getConversionSteps(decimalValue, conversionType);
            setResult(localResult);
            setSteps(explanation);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    }, [decimalInput, conversionType]);


    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
            <main className="w-full max-w-2xl bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-white/30">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-3">
                         <CalculatorIcon className="w-8 h-8 text-brand-primary"/>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
                            Conversor de Bases
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Introduce un número decimal y obtén la conversión y el paso a paso.
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="decimal-input" className="block text-sm font-medium text-brand-text mb-2">
                            Número Decimal
                        </label>
                        <input
                            id="decimal-input"
                            type="number"
                            value={decimalInput}
                            onChange={(e) => setDecimalInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleConvert(); }}
                            placeholder="Ej: 25"
                            className="w-full px-4 py-3 bg-white border border-brand-light rounded-lg text-brand-text text-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow"
                        />
                    </div>

                    <ConversionTypeSelector selected={conversionType} onSelect={setConversionType} />
                    
                    <div>
                        <button
                            onClick={handleConvert}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary transition-all duration-200 disabled:bg-brand-secondary disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Convirtiendo...
                                </>
                            ) : (
                                'Convertir'
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                
                <ResultDisplay result={result} steps={steps} />
            </main>
        </div>
    );
};

export default App;

