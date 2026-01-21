import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageCircle } from 'lucide-react';

export const PreQualifyForm = () => {
    const { profile, addLead } = useContent();
    const [formData, setFormData] = useState({ name: '', phone: '', id: '', income: '' });

    const handleWhatsApp = () => {
        const { name, phone, id, income } = formData;
        if (!name || !phone || !id || !income) {
            alert("Por favor completa todos los datos para pre-calificar.");
            return;
        }

        // Save lead to internal DB (Context)
        addLead(formData);

        const message = `Hola ${profile.name}, quiero pre-calificar para un auto.%0A%0A*Mis Datos:*%0A- Nombre: ${name}%0A- Teléfono: ${phone}%0A- Cédula: ${id}%0A- Ingresos: $${income}`;
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
                    className="bg-brand-900 border-brand-700"
                />
                <Input
                    placeholder="Número de Cédula"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="bg-brand-900 border-brand-700"
                />
                <Input
                    placeholder="Tu Teléfono / Celular"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-brand-900 border-brand-700"
                />
                <Input
                    placeholder="Ingreso Mensual ($)"
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="bg-brand-900 border-brand-700"
                />
            </div>

            <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-500 text-white h-14 text-lg font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
            >
                <MessageCircle size={24} /> Enviar por WhatsApp
            </Button>
        </div>
    );
};
