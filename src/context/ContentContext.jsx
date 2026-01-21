import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const defaultProfile = {
    name: 'Paola Peña',
    title: 'Tu Auto Nuevo en 24h',
    phone: '593999999999',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badges: ['Asesora Certificada', 'Top Ventas 2024'],
    activeBadges: true,
};

const defaultCalculator = {
    interestRate: 16,
    minDownPaymentPct: 20,
    minPrice: 10000,
    maxPrice: 60000,
    availableTerms: [12, 24, 36, 48, 60] // Default terms
};

const defaultGallery = [
    { id: 1, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400', caption: 'Entrega Toyota Fortuner' },
    { id: 2, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400', caption: 'Cliente Feliz' },
];

const defaultVisibility = {
    calculator: true,
    gallery: true,
    form: true
};

export const ContentProvider = ({ children }) => {
    // --- STATE ---
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('crediAuto_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    });

    const [calculatorConfig, setCalculatorConfig] = useState(() => {
        const saved = localStorage.getItem('crediAuto_calculator');
        return saved ? JSON.parse(saved) : defaultCalculator;
    });

    const [gallery, setGallery] = useState(() => {
        const saved = localStorage.getItem('crediAuto_gallery');
        return saved ? JSON.parse(saved) : defaultGallery;
    });

    const [visibility, setVisibility] = useState(() => {
        const saved = localStorage.getItem('crediAuto_visibility');
        return saved ? JSON.parse(saved) : defaultVisibility;
    });

    const [leads, setLeads] = useState(() => {
        const saved = localStorage.getItem('crediAuto_leads');
        return saved ? JSON.parse(saved) : [];
    });

    // --- EFFECTS (Persistence) ---
    useEffect(() => localStorage.setItem('crediAuto_profile', JSON.stringify(profile)), [profile]);
    useEffect(() => localStorage.setItem('crediAuto_calculator', JSON.stringify(calculatorConfig)), [calculatorConfig]);
    useEffect(() => localStorage.setItem('crediAuto_gallery', JSON.stringify(gallery)), [gallery]);
    useEffect(() => localStorage.setItem('crediAuto_visibility', JSON.stringify(visibility)), [visibility]);
    useEffect(() => localStorage.setItem('crediAuto_leads', JSON.stringify(leads)), [leads]);

    // --- ACTIONS ---
    const updateProfile = (data) => setProfile(prev => ({ ...prev, ...data }));

    const updateCalculator = (data) => setCalculatorConfig(prev => ({ ...prev, ...data }));

    const toggleSection = (section) => setVisibility(prev => ({ ...prev, [section]: !prev[section] }));

    const addGalleryItem = (url, caption) => {
        setGallery(prev => [...prev, { id: Date.now(), image: url, caption }]);
    };

    const removeGalleryItem = (id) => {
        setGallery(prev => prev.filter(item => item.id !== id));
    };

    const addLead = (lead) => {
        const newLead = { ...lead, id: Date.now(), date: new Date().toISOString() };
        setLeads(prev => [newLead, ...prev]);
    };

    return (
        <ContentContext.Provider value={{
            profile, updateProfile,
            calculatorConfig, updateCalculator,
            gallery, addGalleryItem, removeGalleryItem,
            visibility, toggleSection,
            leads, addLead
        }}>
            {children}
        </ContentContext.Provider>
    );
};
