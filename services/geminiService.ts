import { GoogleGenAI } from "@google/genai";
import { ConversionType } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getBaseDetails = (type: ConversionType) => {
    switch (type) {
        case ConversionType.BINARY:
            return { name: "Binario", base: 2 };
        case ConversionType.OCTAL:
            return { name: "Octal", base: 8 };
        case ConversionType.HEX:
            return { name: "Hexadecimal", base: 16 };
        default:
            throw new Error("Invalid conversion type");
    }
};

export const getConversionSteps = async (decimal: number, conversionType: ConversionType): Promise<string> => {
    const { name, base } = getBaseDetails(conversionType);

    const prompt = `
Eres un profesor de matemáticas y computación extremadamente didáctico. Tu especialidad es hacer que conceptos complejos parezcan sencillos.
Tu objetivo es explicar el proceso de conversión de un número decimal a otra base (binaria, octal o hexadecimal) con un nivel de detalle excepcional.

Tarea Específica:
Explica el proceso paso a paso para convertir el número decimal "${decimal}" a ${name} (base ${base}).

Reglas de la Explicación (¡Muy Importante!):
1.  Usa exclusivamente el método de divisiones sucesivas.
2.  Para cada división, detalla CÓMO encuentras cada número. No solo muestres el resultado. Explica:
    - El número a dividir y el divisor (la base de conversión).
    - Cómo calculas el cociente. Por ejemplo: "Para dividir 150 entre 16, buscamos cuántas veces cabe 16 en 150. Vemos que 16 * 9 = 144, que es lo más cercano sin pasarse. Así que el cociente es 9".
    - Cómo calculas el residuo. Por ejemplo: "Para encontrar el residuo, restamos el resultado anterior del número original: 150 - 144 = 6. El residuo es 6".
    - Cada paso debe ser una mini-lección clara.
3.  Explica que el cociente de una división se usa como el nuevo número a dividir en el siguiente paso, hasta que el cociente sea 0.
4.  Al final de las divisiones, muestra la lista de residuos que encontraste. Explica que el resultado final se construye leyendo estos residuos en orden inverso (del último al primero).
5.  Si es hexadecimal y un residuo es mayor que 9, explica su letra correspondiente (ej: 10 es A, 11 es B, etc.).
6.  Usa solo texto plano. Sin Markdown. Estructura la respuesta con encabezados simples como "Paso 1: Primera División".
7.  Termina la explicación con una línea final y separada: "Resultado final: [número convertido]". No incluyas el resultado en medio de la explicación.

Ahora, genera la explicación ultra detallada para convertir el número ${decimal} a ${name}.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching conversion steps from Gemini:", error);
        throw new Error("No se pudo obtener la explicación de la conversión. Por favor, inténtelo de nuevo.");
    }
};
