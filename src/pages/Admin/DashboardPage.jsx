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
                    <img src={profileForm.photo} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-accent mx-auto mb-4" />
                    <p className="text-xs text-tech-gray">Vista Previa</p>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                    <Input
                        label="Nombre Completo"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                    <Input
                        label="Título / Slogan"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    />
                    <Input
                        label="WhatsApp (Sin +)"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
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
                <label htmlFor="badges" className="text-sm select-none">Mostrar Badges (Certificada, Top Ventas)</label>
            </div>

            <Button onClick={saveProfile} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2">
                <Save size={18} /> Guardar Cambios
            </Button>
        </Card>
    );

    const renderCalculatorTab = () => (
        <Card className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calculator size={20} /> Configuración Financiera</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Tasa de Interés Anual (%)"
                    type="number"
                    value={calcForm.interestRate}
                    onChange={(e) => setCalcForm({ ...calcForm, interestRate: Number(e.target.value) })}
                />
                <Input
                    label="Entrada Mínima (%)"
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
                <label className="text-sm font-medium text-tech-gray mb-2 block">Plazos Disponibles (Meses)</label>
                <div className="flex gap-4">
                    {[12, 24, 36, 48, 60, 72].map(term => (
                        <label key={term} className="flex items-center gap-2 cursor-pointer bg-brand-900 border border-brand-700 px-3 py-2 rounded-lg hover:border-accent">
                            <input
                                type="checkbox"
                                checked={calcForm.availableTerms.includes(term)}
                                onChange={(e) => {
                                    const newTerms = e.target.checked
                                        ? [...calcForm.availableTerms, term].sort((a, b) => a - b)
                                        : calcForm.availableTerms.filter(t => t !== term);
                                    setCalcForm({ ...calcForm, availableTerms: newTerms });
                                }}
                                className="accent-accent"
                            />
                            <span className="text-sm">{term}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button onClick={saveCalculator} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2">
                <Save size={18} /> Actualizar Calculadora
            </Button>
        </Card>
    );

    const renderGalleryTab = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Section Toggles */}
            <Card className="border-l-4 border-l-accent">
                <h3 className="font-bold mb-4">Visibilidad de Secciones</h3>
                <div className="flex gap-4">
                    {Object.entries(visibility).map(([key, isVisible]) => (
                        <button
                            key={key}
                            onClick={() => toggleSection(key)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold capitalize",
                                isVisible ? "bg-green-500/10 border-green-500 text-green-500" : "bg-red-500/10 border-red-500 text-red-500"
                            )}
                        >
                            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />} {key}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Gallery Management */}
            <Card>
                <h2 className="text-xl font-bold mb-4">Gestión de Galería</h2>

                {/* Image List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {gallery.map(item => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-brand-700">
                            <img src={item.image} alt={item.caption} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <button
                                    onClick={() => removeGalleryItem(item.id)}
                                    className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 hover:scale-110 transition-transform"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 w-full bg-black/50 p-1 text-[10px] text-center truncate px-2">
                                {item.caption}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Form */}
                <form onSubmit={handleAddImage} className="bg-brand-900 p-4 rounded-xl border border-brand-700">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Plus size={16} className="text-accent" /> Añadir Nueva Foto</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="URL de la imagen"
                            value={newImage.url}
                            onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                        />
                        <Input
                            placeholder="Descripción (Caption)"
                            value={newImage.caption}
                            onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                        />
                        <Button className="mt-1 md:w-auto h-full self-end">Añadir</Button>
                    </div>
                </form>
            </Card>
        </div>
    );

    const renderLeadsTab = () => (
        <Card className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users size={20} /> Leads Recibidos ({leads.length})</h2>

            {leads.length === 0 ? (
                <p className="text-center text-tech-gray py-8">No hay leads todavía.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-brand-700 text-tech-gray">
                                <th className="pb-3 pl-2">Fecha</th>
                                <th className="pb-3">Nombre</th>
                                <th className="pb-3">Cédula</th>
                                <th className="pb-3">Ingresos</th>
                                <th className="pb-3 text-right pr-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-800">
                            {leads.map(lead => (
                                <tr key={lead.id} className="group hover:bg-brand-800/50 transition-colors">
                                    <td className="py-3 pl-2 text-tech-gray">{new Date(lead.date).toLocaleDateString()}</td>
                                    <td className="py-3 font-medium text-white">{lead.name}</td>
                                    <td className="py-3 text-tech-gray">{lead.id}</td>
                                    <td className="py-3 text-green-400 font-medium">${lead.income}</td>
                                    <td className="py-3 text-right pr-2">
                                        <a
                                            href={`https://wa.me/${lead.phone}?text=Hola ${lead.name}, soy ${profile.name}. Recibí tu solicitud de pre-calificación en CrediAuto.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition-all text-xs border border-green-500/20"
                                        >
                                            <MessageCircle size={14} /> Contactar
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
        <div className="min-h-screen bg-brand-900 text-tech-white">
            <nav className="bg-brand-800 border-b border-brand-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <span className="font-bold text-lg text-accent">Admin BioSite Pro</span>
                <Button variant="danger" onClick={handleLogout} className="text-sm py-1 px-3">
                    <LogOut size={16} />
                </Button>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="grid grid-cols-4 gap-2 mb-8 bg-brand-800 p-1 rounded-xl">
                    <button onClick={() => setActiveTab('profile')} className={clsx("py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1", activeTab === 'profile' ? "bg-brand-700 text-white shadow-sm" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <User size={18} /> <span className="hidden md:inline">Perfil</span>
                    </button>
                    <button onClick={() => setActiveTab('calculator')} className={clsx("py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1", activeTab === 'calculator' ? "bg-brand-700 text-white shadow-sm" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Calculator size={18} /> <span className="hidden md:inline">Calculadora</span>
                    </button>
                    <button onClick={() => setActiveTab('gallery')} className={clsx("py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1", activeTab === 'gallery' ? "bg-brand-700 text-white shadow-sm" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <ImageIcon size={18} /> <span className="hidden md:inline">Galería</span>
                    </button>
                    <button onClick={() => setActiveTab('leads')} className={clsx("py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1", activeTab === 'leads' ? "bg-brand-700 text-white shadow-sm" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Users size={18} /> <span className="hidden md:inline">Leads</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
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
