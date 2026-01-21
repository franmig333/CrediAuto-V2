import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import {
    LogOut, User, Calculator, Image as ImageIcon, Users,
    Save, Trash2, Plus, Eye, EyeOff, MessageCircle, Upload, Loader2,
    FileSpreadsheet, FileText, Share2, CheckSquare, Square, X
} from 'lucide-react';
import clsx from 'clsx';
import { compressImage } from '../../utils/imageUtils';

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
    const [isProcessing, setIsProcessing] = useState(false);

    // Forms state
    const [profileForm, setProfileForm] = useState(profile);
    const [calcForm, setCalcForm] = useState(calculatorConfig);
    const [newImage, setNewImage] = useState({ url: '', caption: '' });

    // CRM State
    const [selectedLeads, setSelectedLeads] = useState([]);

    // Logic Vars
    const [newTerm, setNewTerm] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    // --- SMART UPLOAD ---
    const handleSmartUpload = async (event, callback) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const compressedBase64 = await compressImage(file);
            callback(compressedBase64);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
            event.target.value = '';
        }
    };

    // --- ACTIONS ---
    const saveProfile = () => {
        updateProfile(profileForm);
        alert('Perfil actualizado');
    };

    const saveCalculator = () => {
        if (calcForm.availableTerms.length === 0) {
            alert("Debes tener al menos un plazo disponible.");
            return;
        }
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

    // --- DYNAMIC FIELDS LOGIC ---
    const addCustomField = () => {
        const newField = { id: Date.now(), label: 'Nueva Etiqueta', value: 'Valor' };
        setProfileForm(prev => ({
            ...prev,
            customFields: [...(prev.customFields || []), newField]
        }));
    };

    const updateCustomField = (id, key, value) => {
        setProfileForm(prev => ({
            ...prev,
            customFields: prev.customFields.map(f => f.id === id ? { ...f, [key]: value } : f)
        }));
    };

    const removeCustomField = (id) => {
        setProfileForm(prev => ({
            ...prev,
            customFields: prev.customFields.filter(f => f.id !== id)
        }));
    };

    // --- DYNAMIC TERMS LOGIC ---
    const addTerm = () => {
        const termVal = parseInt(newTerm);
        if (!termVal || termVal <= 0) return;
        if (!calcForm.availableTerms.includes(termVal)) {
            setCalcForm(prev => ({
                ...prev,
                availableTerms: [...prev.availableTerms, termVal].sort((a, b) => a - b)
            }));
        }
        setNewTerm('');
    };

    const removeTerm = (termToRemove) => {
        if (calcForm.availableTerms.length <= 1) {
            alert("No puedes borrar todos los plazos.");
            return;
        }
        setCalcForm(prev => ({
            ...prev,
            availableTerms: prev.availableTerms.filter(t => t !== termToRemove)
        }));
    };

    // --- CRM BULK ACTIONS ---
    const toggleSelectAll = () => {
        if (selectedLeads.length === leads.length && leads.length > 0) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.id));
        }
    };

    const toggleSelectLead = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(prev => prev.filter(lid => lid !== id));
        } else {
            setSelectedLeads(prev => [...prev, id]);
        }
    };

    const exportCSV = () => {
        const data = leads.filter(l => selectedLeads.includes(l.id));
        if (data.length === 0) return;

        const headers = ["Fecha", "Nombre", "Cédula", "Teléfono", "Auto Interés", "Ingreso"];
        const rows = data.map(l => [
            new Date(l.date).toLocaleDateString(),
            l.name,
            l.id,
            l.phone,
            l.carInterest || '-',
            l.income
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads_crediauto.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printReport = () => {
        const data = leads.filter(l => selectedLeads.includes(l.id));
        if (data.length === 0) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte de Leads</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1 { color: #E62429; }
                    </style>
                </head>
                <body>
                    <h1>Reporte de Leads - CrediAuto</h1>
                    <p>Generado: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre</th>
                                <th>Cédula</th>
                                <th>Teléfono</th>
                                <th>Auto</th>
                                <th>Ingreso</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(l => `
                                <tr>
                                    <td>${new Date(l.date).toLocaleDateString()}</td>
                                    <td>${l.name}</td>
                                    <td>${l.id}</td>
                                    <td>${l.phone}</td>
                                    <td>${l.carInterest || '-'}</td>
                                    <td>$${l.income}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const forwardToWhatsApp = () => {
        const data = leads.filter(l => selectedLeads.includes(l.id));
        if (data.length === 0) return;

        const summary = data.map((l, i) => `${i + 1}. ${l.name} (${l.phone}) - ${l.carInterest || 'Auto Genérico'}`).join('%0A');
        const message = `*Resumen de Leads Seleccionados:*%0A%0A${summary}`;
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    // --- RENDERERS ---

    const renderProfileTab = () => (
        <Card className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} /> Constructor de Perfil</h2>

            {/* Main Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 text-center">
                    <div className="relative inline-block group">
                        <img src={profileForm.photo} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-accent mx-auto mb-4 bg-brand-900" />
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>
                        )}
                        <label className="absolute bottom-4 right-0 bg-accent p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                            <Upload size={14} className="text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSmartUpload(e, (b64) => setProfileForm({ ...profileForm, photo: b64 }))} />
                        </label>
                    </div>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                    <Input label="Nombre Visible" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                    <Input label="Eslogan" value={profileForm.title} onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })} />
                    <Input label="Texto Botón WhatsApp" value={profileForm.whatsappButtonText} onChange={(e) => setProfileForm({ ...profileForm, whatsappButtonText: e.target.value })} />
                </div>
            </div>

            {/* Dynamic Fields */}
            <div className="border-t border-brand-700 pt-6">
                <h3 className="font-bold mb-4 flex items-center justify-between">
                    <span>Detalles Dinámicos (Header)</span>
                    <Button onClick={addCustomField} variant="secondary" className="text-xs py-1 px-3 flex items-center gap-1">
                        <Plus size={14} /> Nuevo Campo
                    </Button>
                </h3>

                <div className="space-y-3">
                    {profileForm.customFields?.length === 0 && <p className="text-sm text-tech-gray italic">Sin detalles extra (ej: Horario, Dirección).</p>}

                    {profileForm.customFields?.map((field) => (
                        <div key={field.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-4">
                            <Input
                                placeholder="Etiqueta (ej: Horario)"
                                value={field.label}
                                onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                                className="w-1/3"
                            />
                            <Input
                                placeholder="Valor (ej: 9am - 6pm)"
                                value={field.value}
                                onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                className="w-2/3"
                            />
                            <button onClick={() => removeCustomField(field.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={saveProfile} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2 mt-4">
                <Save size={18} /> Guardar Perfil V4
            </Button>
        </Card>
    );

    const renderCalculatorTab = () => (
        <Card className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calculator size={20} /> Lógica Financiera Flexible</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Tasa Interés Anual (%)" type="number" value={calcForm.interestRate} onChange={(e) => setCalcForm({ ...calcForm, interestRate: Number(e.target.value) })} />
                <Input label="Entrada Mínima (%)" type="number" value={calcForm.minDownPaymentPct} onChange={(e) => setCalcForm({ ...calcForm, minDownPaymentPct: Number(e.target.value) })} />
                <Input label="Precio Mínimo ($)" type="number" value={calcForm.minPrice} onChange={(e) => setCalcForm({ ...calcForm, minPrice: Number(e.target.value) })} />
                <Input label="Precio Máximo ($)" type="number" value={calcForm.maxPrice} onChange={(e) => setCalcForm({ ...calcForm, maxPrice: Number(e.target.value) })} />
                <div className="md:col-span-2">
                    <Input
                        label="Gasto/Seguro Adicional Mensual ($)"
                        type="number"
                        value={calcForm.extraFee || 0}
                        onChange={(e) => setCalcForm({ ...calcForm, extraFee: Number(e.target.value) })}
                        className="bg-brand-900 border-accent/30 focus:border-accent"
                    />
                    <p className="text-[10px] text-tech-gray mt-1">Este valor se sumará automáticamente a la cuota final calculada.</p>
                </div>
            </div>

            {/* Dynamic Terms */}
            <div className="bg-brand-900 p-4 rounded-xl border border-brand-700">
                <label className="text-sm font-bold text-white mb-3 block">Constructor de Plazos (Meses)</label>

                <div className="flex flex-wrap gap-2 mb-4">
                    {calcForm.availableTerms.map(term => (
                        <span key={term} className="inline-flex items-center gap-1 bg-brand-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                            {term}m
                            <button onClick={() => removeTerm(term)} className="hover:text-red-400 ml-1"><X size={14} /></button>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Ej: 72"
                        type="number"
                        value={newTerm}
                        onChange={(e) => setNewTerm(e.target.value)}
                        className="w-24"
                    />
                    <Button onClick={addTerm} variant="secondary" className="px-4"><Plus size={18} /></Button>
                </div>
            </div>

            <Button onClick={saveCalculator} className="w-full bg-accent hover:bg-accent-hover text-white flex justify-center items-center gap-2">
                <Save size={18} /> Actualizar Lógica
            </Button>
        </Card>
    );

    const renderGalleryTab = () => (
        // Re-using logic but cleaner
        <div className="space-y-6 animate-fade-in">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Galería V4</h2>
                    <label className="bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-bold transition-colors">
                        <Upload size={16} />
                        {isProcessing ? "Procesando..." : "Subir Foto"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSmartUpload(e, (b64) => { if (b64) addGalleryItem(b64, 'Nueva Foto'); })} />
                    </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {gallery.map(item => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden aspect-square border border-brand-700">
                            <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                            <button onClick={() => removeGalleryItem(item.id)} className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderLeadsTab = () => (
        <Card className="animate-fade-in p-0 overflow-hidden">
            <div className="p-6 border-b border-brand-700 bg-brand-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users size={20} /> CRM ({leads.length})</h2>

                {selectedLeads.length > 0 && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <Button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 h-9 text-xs px-3"><FileSpreadsheet size={16} className="mr-1" /> CSV</Button>
                        <Button onClick={printReport} className="bg-blue-600 hover:bg-blue-700 h-9 text-xs px-3"><FileText size={16} className="mr-1" /> PDF</Button>
                        <Button onClick={forwardToWhatsApp} className="bg-teal-600 hover:bg-teal-700 h-9 text-xs px-3"><Share2 size={16} className="mr-1" /> A mi WhatsApp</Button>
                    </div>
                )}
            </div>

            {leads.length === 0 ? (
                <p className="text-center text-tech-gray py-12">No hay leads.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-brand-900 text-tech-gray uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="py-4 pl-4 w-10 text-center">
                                    <button onClick={toggleSelectAll}>
                                        {selectedLeads.length === leads.length && leads.length > 0 ? <CheckSquare size={18} className="text-accent" /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th className="py-4">Fecha/Cliente</th>
                                <th className="py-4">Detalles</th>
                                <th className="py-4 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-800 bg-brand-800/30">
                            {leads.map(lead => (
                                <tr key={lead.id} className={clsx("group transition-colors", selectedLeads.includes(lead.id) ? "bg-accent/10" : "hover:bg-brand-800")}>
                                    <td className="py-4 pl-4 text-center">
                                        <button onClick={() => toggleSelectLead(lead.id)}>
                                            {selectedLeads.includes(lead.id) ? <CheckSquare size={18} className="text-accent" /> : <Square size={18} className="text-tech-gray" />}
                                        </button>
                                    </td>
                                    <td className="py-4">
                                        <div className="font-bold text-white">{lead.name}</div>
                                        <div className="text-xs text-tech-gray">{new Date(lead.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className="text-white text-xs"><span className="text-tech-gray">Auto:</span> {lead.carInterest || '-'}</div>
                                        <div className="text-green-400 font-bold text-xs"><span className="text-tech-gray font-normal">Ing:</span> ${lead.income}</div>
                                    </td>
                                    <td className="py-4 text-right pr-6">
                                        <a
                                            href={`https://wa.me/${lead.phone}?text=Hola ${lead.name}...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-500 hover:text-white transition-colors"
                                        >
                                            <MessageCircle size={18} />
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
                    <div className="bg-accent w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">V4</div>
                    <span className="font-bold text-lg hidden md:block">Admin Pro</span>
                </div>
                <Button variant="danger" onClick={handleLogout} className="text-sm py-2 px-4 flex items-center gap-2">
                    <LogOut size={16} /> <span className="hidden md:inline">Cerrar Sesión</span>
                </Button>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="grid grid-cols-4 gap-2 mb-8 bg-brand-800 p-1.5 rounded-xl shadow-lg border border-brand-700">
                    <button onClick={() => setActiveTab('profile')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'profile' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <User size={18} /> <span className="hidden sm:inline">Perfil V4</span>
                    </button>
                    <button onClick={() => setActiveTab('calculator')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'calculator' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Calculator size={18} /> <span className="hidden sm:inline">Cerebro</span>
                    </button>
                    <button onClick={() => setActiveTab('gallery')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'gallery' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <ImageIcon size={18} /> <span className="hidden sm:inline">Galería</span>
                    </button>
                    <button onClick={() => setActiveTab('leads')} className={clsx("py-3 rounded-lg text-xs md:text-sm font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-2", activeTab === 'leads' ? "bg-brand-700 text-white shadow-sm ring-1 ring-brand-600" : "text-tech-gray hover:text-white hover:bg-brand-700/50")}>
                        <Users size={18} /> <span className="hidden sm:inline">CRM</span>
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
