import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageCircle } from 'lucide-react';

export const PreQualifyForm = () => {
    const { profile, addLead } = useContent();
    const [formData, setFormData] = useState({ name: '', phone: '', id: '', income: '', carInterest: '' });

    const handleWhatsApp = () => {
        const { name, phone, id, income, carInterest } = formData;
        if (!name || !phone || !id || !income) {
            alert("Por favor completa todos los datos obligatorios.");
            return;
        }

        // Save lead
        addLead(formData);

        const message = `Hola ${profile.name}, quiero pre-calificar.%0A%0A*Mis Datos:*%0A- Nombre: ${name}%0A- Cédula: ${id}%0A- Teléfono: ${phone}%0A- Ingresos: $${income}%0A- Auto de Interés: ${carInterest || 'No especificado'}`;
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
                <Input
                    placeholder="Tu Teléfono / Celular"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
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
                className="w-full bg-green-600 hover:bg-green-500 text-white h-14 text-lg font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
            >
                <MessageCircle size={24} /> {profile.whatsappButtonText || 'Enviar por WhatsApp'}
            </Button>
        </div>
    );
};
