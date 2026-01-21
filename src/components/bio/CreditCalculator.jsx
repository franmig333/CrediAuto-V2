import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import clsx from 'clsx';
import { useContent } from '../../context/ContentContext';

export const CreditCalculator = () => {
    const { calculatorConfig } = useContent();
    const { interestRate, minDownPaymentPct, minPrice, maxPrice, availableTerms } = calculatorConfig;

    const [carPrice, setCarPrice] = useState(minPrice);
    const [downPayment, setDownPayment] = useState(minPrice * (minDownPaymentPct / 100));
    const [term, setTerm] = useState(availableTerms[0] || 48);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    // Validate reset on config change
    useEffect(() => {
        if (carPrice < minPrice) setCarPrice(minPrice);
        if (carPrice > maxPrice) setCarPrice(maxPrice);
        if (!availableTerms.includes(term)) setTerm(availableTerms[0]);
    }, [calculatorConfig]);

    // Recalculate PMT
    useEffect(() => {
        const minDown = carPrice * (minDownPaymentPct / 100);
        let effectiveDown = downPayment;

        // Auto-adjust down payment if below minimum
        if (effectiveDown < minDown) {
            effectiveDown = minDown;
            // Only update state if it's strictly necessary to avoid loops, 
            // usually better to just visually show validation, but for simplicity:
            // setDownPayment(minDown); 
        }

        const loanAmount = carPrice - effectiveDown;
        if (loanAmount <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const r = (interestRate / 100) / 12;
        // PMT
        const numerator = loanAmount * r * Math.pow(1 + r, term);
        const denominator = Math.pow(1 + r, term) - 1;

        setMonthlyPayment(numerator / denominator);
    }, [carPrice, downPayment, term, interestRate, minDownPaymentPct]);

    return (
        <Card className="mx-4 mb-8 bg-brand-800/50 backdrop-blur-sm border-brand-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full"></span>
                Calcula tu Cuota
                <span className="text-xs text-tech-gray font-normal ml-auto bg-brand-900 px-2 py-1 rounded">Tasa: {interestRate}%</span>
            </h2>

            {/* Car Price Slider */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <label className="text-tech-gray">Precio del Auto</label>
                    <span className="font-bold text-white">${carPrice.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="500"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="w-full h-2 bg-brand-700 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-xs text-tech-gray mt-1">
                    <span>${minPrice.toLocaleString()}</span>
                    <span>${maxPrice.toLocaleString()}</span>
                </div>
            </div>

            {/* Down Payment Input */}
            <div className="mb-6">
                <label className="block text-sm text-tech-gray mb-2">
                    Entrada Inicial (Mín {minDownPaymentPct}%)
                </label>
                <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className={clsx(
                        "w-full bg-brand-900 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1",
                        downPayment < (carPrice * minDownPaymentPct / 100) ? "border-red-500 focus:border-red-500" : "border-brand-700 focus:border-accent focus:ring-accent"
                    )}
                />
                {downPayment < (carPrice * minDownPaymentPct / 100) && (
                    <p className="text-red-500 text-xs mt-1">La entrada mínima es ${(carPrice * minDownPaymentPct / 100).toLocaleString()}</p>
                )}
            </div>

            {/* Terms */}
            <div className="flex flex-wrap gap-2 mb-8">
                {availableTerms.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTerm(t)}
                        className={clsx(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all min-w-[60px]",
                            term === t
                                ? "bg-accent text-white shadow-[0_0_10px_rgba(230,36,41,0.5)]"
                                : "bg-brand-900 text-tech-gray hover:bg-brand-700"
                        )}
                    >
                        {t}m
                    </button>
                ))}
            </div>

            {/* Result */}
            <div className="text-center pt-4 border-t border-brand-700">
                <p className="text-sm text-tech-gray mb-1">Cuota Mensual Estimada</p>
                <p className="text-4xl font-bold text-accent">
                    ${monthlyPayment.toFixed(2)}
                </p>
            </div>
        </Card>
    );
};
