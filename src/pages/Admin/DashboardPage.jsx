import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import {
    LogOut, User, Calculator, Image as ImageIcon, Users,
    Save, Trash2, Plus, Eye, EyeOff, MessageCircle
} from 'lucide-react';
import clsx from 'clsx';

const DashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        profile, updateProfile,
        calculatorConfig, updateCalculator,
        gallery, addGalleryItem, removeGalleryItem,
        visibility, toggleSection,
        leads
    } = useContent();

    const [activeTab, setActiveTab] = useState('profile');

    // Forms state
    const [profileForm, setProfileForm] = useState(profile);
    const [calcForm, setCalcForm] = useState(calculatorConfig);
    const [newImage, setNewImage] = useState({ url: '', caption: '' });

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    // --- SAVE HANDLERS ---
    const saveProfile = () => {
        updateProfile(profileForm);
        alert('Perfil actualizado');
    };

    const saveCalculator = () => {
        updateCalculator(calcForm);
        alert('Calculadora actualizada');
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        if (newImage.url && newImage.caption) {
            addGalleryItem(newImage.url, newImage.caption);
            setNewImage({ url: '', caption: '' });
        }
    };

    // --- TAB RENDERERS ---

    const renderProfileTab = () => (
        <Card className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} /> Personalización de Perfil</h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 text-center">
                    <img src={profileForm.photo} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-accent mx-auto mb-4 bg-brand-900" />
                    <p className="text-xs text-tech-gray">Vista Previa</p>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                    <Input
                        label="Nombre Principal"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                    <Input
                        label="Título / Slogan"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    />
                    <Input
                        label="Texto Botón WhatsApp"
                        value={profileForm.whatsappButtonText || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsappButtonText: e.target.value })}
                        placeholder="Ej: Enviar por WhatsApp"
                    />
                    <Input
                        label="URL Foto Perfil"
                        value={profileForm.photo}
                        onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-brand-700">
                <input
                    type="checkbox"
                    id="badges"
                    checked={profileForm.activeBadges}
                    onChange={(e) => setProfileForm({ ...profileForm, activeBadges: e.target.checked })}
                    className="w-4 h-4 rounded border-brand-600 bg-brand-800 accent-accent"
                />
                <label htmlFor="badges" className="text-sm select-none cursor-pointer">Mostrar Badge 'Asesora Certificada'</label>
            </div>

            <Button onClick={saveProfile} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2">
                <Save size={18} /> Guardar Perfil
            </Button>
        </Card>
    );

    const renderCalculatorTab = () => (
        <Card className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calculator size={20} /> Cerebro Calculadora</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Tasa de Interés Anual (%)"
                    type="number"
                    value={calcForm.interestRate}
                    onChange={(e) => setCalcForm({ ...calcForm, interestRate: Number(e.target.value) })}
                />
                <Input
                    label="Entrada Mínima Requerida (%)"
                    type="number"
                    value={calcForm.minDownPaymentPct}
                    onChange={(e) => setCalcForm({ ...calcForm, minDownPaymentPct: Number(e.target.value) })}
                />
                <Input
                    label="Precio Mínimo Auto ($)"
                    type="number"
                    value={calcForm.minPrice}
                    onChange={(e) => setCalcForm({ ...calcForm, minPrice: Number(e.target.value) })}
                />
                <Input
                    label="Precio Máximo Auto ($)"
                    type="number"
                    value={calcForm.maxPrice}
                    onChange={(e) => setCalcForm({ ...calcForm, maxPrice: Number(e.target.value) })}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-tech-gray mb-2 block">Plazos a Ofrecer (Meses)</label>
                <div className="flex flex-wrap gap-4">
                    {[12, 24, 36, 48, 60].map(term => (
                        <label key={term} className="flex items-center gap-2 cursor-pointer bg-brand-900 border border-brand-700 px-3 py-2 rounded-lg hover:border-accent transition-colors">
                            <input
                                type="checkbox"
                                checked={calcForm.availableTerms.includes(term)}
                                onChange={(e) => {
                                    const newTerms = e.target.checked
                                        ? [...calcForm.availableTerms, term].sort((a, b) => a - b)
                                        : calcForm.availableTerms.filter(t => t !== term);
                                    setCalcForm({ ...calcForm, availableTerms: newTerms });
                                }}
                                className="accent-accent w-4 h-4"
                            />
                            <span className="text-sm font-bold">{term}m</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button onClick={saveCalculator} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2">
                <Save size={18} /> Actualizar Reglas de Negocio
            </Button>
        </Card>
    );

    const renderGalleryTab = () => (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <h2 className="text-xl font-bold mb-4">Gestión de Galería</h2>

                {/* Image List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {gallery.map(item => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-brand-700 aspect-square">
                            <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <button
                                    onClick={() => removeGalleryItem(item.id)}
                                    className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 hover:scale-110 transition-transform shadow-lg"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 w-full bg-black/70 p-1 text-[10px] text-center truncate px-2 text-white">
                                {item.caption}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddImage} className="bg-brand-900 p-4 rounded-xl border border-brand-700">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Plus size={16} className="text-accent" /> Añadir Nueva Foto</h4>
                    <div className="flex flex-col gap-3">
                        <Input
                            placeholder="Pegar URL de la imagen aquí..."
                            value={newImage.url}
                            onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                        />
                        <Input
                            placeholder="Descripción corta (ej: Toyota Hilux)"
                            value={newImage.caption}
                            onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                        />
                        <Button className="w-full bg-brand-700 hover:bg-brand-600 text-white">Añadir a Galería</Button>
                    </div>
                </form>
            </Card>
        </div>
    );

    const renderLeadsTab = () => (
        <Card className="animate-fade-in p-0 overflow-hidden">
            <div className="p-6 border-b border-brand-700 bg-brand-800">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users size={20} /> Cotizaciones Recibidas ({leads.length})</h2>
            </div>

            {leads.length === 0 ? (
                <p className="text-center text-tech-gray py-12">No hay cotizaciones registradas aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-brand-900 text-tech-gray uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="py-4 pl-6">Fecha</th>
                                <th className="py-4">Cliente</th>
                                <th className="py-4">Auto Interés</th>
                                <th className="py-4">Ingresos</th>
                                <th className="py-4 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-800 bg-brand-800/30">
                            {leads.map(lead => (
                                <tr key={lead.id} className="group hover:bg-brand-800 transition-colors">
                                    <td className="py-4 pl-6 text-tech-gray whitespace-nowrap">{new Date(lead.date).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <div className="font-bold text-white">{lead.name}</div>
                                        <div className="text-xs text-tech-gray">{lead.id}</div>
                                    </td>
                                    <td className="py-4 text-white">{lead.carInterest || '-'}</td>
                                    <td className="py-4 text-green-400 font-bold">${lead.income}</td>
                                    <td className="py-4 text-right pr-6">
                                        <a
                                            href={`https://wa.me/${lead.phone}?text=Hola ${lead.name}, soy ${profile.name} de CrediAuto. Vi que te interesa un ${lead.carInterest || 'auto'}...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-all text-xs font-bold shadow-lg shadow-green-900/20"
                                        >
                                            <MessageCircle size={16} /> Abrir Chat
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    return (
        <div className="min-h-screen bg-brand-900 text-tech-white font-sans">
            <nav className="bg-brand-800 border-b border-brand-700 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
                <div className="flex items-center gap-2">
                    <div className="bg-accent w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">A</div>
                    <span className="font-bold text-lg hidden md:block">Panel de Control</span>
                </div>
                <Button variant="danger" onClick={handleLogout} className="text-sm py-2 px-4 flex items-center gap-2">
                    <LogOut size={16} /> <span className="hidden md:inline">Cerrar Sesión</span>
                </Button>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="grid grid-cols-4 gap-2 mb-8 bg-brand-800 p-1.5 rounded-xl shadow-lg border border-brand-700">
                    <button onClick={() => setActiveTab('profile')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'profile' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <User size={18} /> <span className="hidden sm:inline">Perfil Bio</span>
                    </button>
                    <button onClick={() => setActiveTab('calculator')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'calculator' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Calculator size={18} /> <span className="hidden sm:inline">Cerebro</span>
                    </button>
                    <button onClick={() => setActiveTab('gallery')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'gallery' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <ImageIcon size={18} /> <span className="hidden sm:inline">Galería</span>
                    </button>
                    <button onClick={() => setActiveTab('leads')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'leads' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Users size={18} /> <span className="hidden sm:inline">Cotizaciones</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'calculator' && renderCalculatorTab()}
                    {activeTab === 'gallery' && renderGalleryTab()}
                    {activeTab === 'leads' && renderLeadsTab()}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
