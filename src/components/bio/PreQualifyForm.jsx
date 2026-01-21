import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageCircle } from 'lucide-react';

export const PreQualifyForm = () => {
    const { profile, addLead } = useContent();
    const [phoneError, setPhoneError] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', id: '', income: '', carInterest: '' });

    const handlePhoneChange = (e) => {
        if (!formData) return; // Safety check
        const val = e.target.value.replace(/\D/g, ''); // Only numbers
        if (val.length > 10) return; // Max 10 chars

        setFormData({ ...formData, phone: val });

        // Real-time validation
        if (val.length > 0 && !val.startsWith('09')) {
            setPhoneError('Debe empezar con 09');
        } else if (val.length > 0 && val.length < 10) {
            setPhoneError('Faltan dígitos (mínimo 10)');
        } else {
            setPhoneError('');
        }
    };

    const isFormValid = () => {
        const { name, phone, id, income } = formData;
        if (!name || !id || !income) return false;
        if (phone.length !== 10 || !phone.startsWith('09')) return false;
        return true;
    };

    const handleWhatsApp = async () => {
        const { name, phone, id, income, carInterest } = formData;

        if (!isFormValid()) return;

        // Save lead
        try {
            await addLead(formData);
        } catch (e) {
            console.error("Error saving lead", e);
        }

        const message = `Hola, quiero pre-calificar. Mis datos:%0A` +
            `Nombre: ${name}%0A` +
            `Cédula: ${id}%0A` +
            `Celular: ${phone}%0A` +
            `Ingresos: $${income}%0A` +
            (carInterest ? `Interés: ${carInterest}` : '');

        window.open(`https://wa.me/${profile.phone}?text=${message}`, '_blank');
    };

    return (
        <div className="bg-brand-800 rounded-t-3xl p-8 border-t border-brand-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Pre-Calificación Mágica ✨</h2>
            <p className="text-tech-gray text-center mb-8 text-sm">Sin buro el crédito es directo.</p>

            <div className="space-y-4 mb-8">
                <Input
                    placeholder="Nombre Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                    placeholder="Número de Cédula"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                />
                <div>
                    <Input
                        placeholder="Tu Celular (09...)"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={phoneError ? "border-red-500 focus:border-red-500" : ""}
                        type="tel"
                    />
                    {phoneError && <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Ingresos ($)"
                        type="number"
                        value={formData.income}
                        onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    />
                    <Input
                        placeholder="Auto de Interés (Opcional)"
                        value={formData.carInterest}
                        onChange={(e) => setFormData({ ...formData, carInterest: e.target.value })}
                    />
                </div>
            </div>

            <Button
                onClick={handleWhatsApp}
                disabled={!isFormValid()}
                className={`w-full h-14 text-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${isFormValid()
                    ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
                    }`}
            >
                <MessageCircle size={24} /> {profile.whatsappButtonText || 'Enviar por WhatsApp'}
            </Button>

            {/* Reassurance Message V5.1 */}
            {profile.outOfHoursMessage && (
                <p className="text-center text-[10px] text-tech-gray mt-4 max-w-xs mx-auto italic opacity-80">
                    {profile.outOfHoursMessage}
                </p>
            )}
        </div>
    );
};
