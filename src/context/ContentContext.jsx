import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const defaultTheme = {
    bg: '#000000',
    card: '#1D1D1D',
    text: '#FFFFFF',
    accent: '#E62429',
};

const defaultProfile = {
    name: 'Paola Peña',
    title: 'Tu Auto Nuevo en 24h',
    phone: '593999999999',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    badges: ['Asesora Certificada', 'Top Ventas 2024'],
    activeBadges: true,
    whatsappButtonText: 'Enviar por WhatsApp',
    customFields: [], // [{ id, label, value }]
    socialNetworks: [], // [{ id, platform, url }]
    schedule: 'Lunes a Viernes: 09:00 - 18:00',
    outOfHoursMessage: 'Puedes escribirnos 24/7. Si estamos fuera de horario, te contactamos a primera hora.',
};

const defaultCalculator = {
    interestRate: 16,
    minDownPaymentPct: 20,
    minPrice: 10000,
    maxPrice: 60000,
    additionalFees: [], // [{ id, name, cost }]
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

    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem('site_theme');
            return saved ? JSON.parse(saved) : defaultTheme;
        } catch (e) {
            return defaultTheme;
        }
    });

    // --- EFFECTS (Persistence) ---
    useEffect(() => localStorage.setItem('crediAuto_profile', JSON.stringify(profile)), [profile]);
    useEffect(() => localStorage.setItem('crediAuto_calculator', JSON.stringify(calculatorConfig)), [calculatorConfig]);
    useEffect(() => localStorage.setItem('crediAuto_gallery', JSON.stringify(gallery)), [gallery]);
    useEffect(() => localStorage.setItem('crediAuto_visibility', JSON.stringify(visibility)), [visibility]);
    useEffect(() => localStorage.setItem('crediAuto_leads', JSON.stringify(leads)), [leads]);

    // Theme Effect - V5 Extreme
    useEffect(() => {
        if (!theme) return; // Crash protection
        localStorage.setItem('site_theme', JSON.stringify(theme));
        const root = document.documentElement;

        // Apply all variables with fallbacks
        root.style.setProperty('--color-bg', theme.bg || defaultTheme.bg);
        root.style.setProperty('--color-card', theme.card || defaultTheme.card);
        root.style.setProperty('--color-text', theme.text || defaultTheme.text);

        const accent = theme.accent || defaultTheme.accent;
        root.style.setProperty('--color-accent', accent);
        root.style.setProperty('--color-accent-hover', accent);
        root.style.setProperty('--color-accent-glow', `${accent}80`);
    }, [theme]);

    // --- ACTIONS ---
    const updateProfile = (data) => setProfile(prev => ({ ...prev, ...data }));

    const updateCalculator = (data) => setCalculatorConfig(prev => ({ ...prev, ...data }));

    const toggleSection = (section) => setVisibility(prev => ({ ...prev, [section]: !prev[section] }));

    const addGalleryItem = (url, caption, title) => {
        setGallery(prev => [...prev, { id: Date.now(), image: url, caption, title }]);
    };

    const removeGalleryItem = (id) => {
        setGallery(prev => prev.filter(item => item.id !== id));
    };

    const updateGalleryItem = (id, updates) => {
        setGallery(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const addLead = (lead) => {
        const newLead = { ...lead, id: Date.now(), date: new Date().toISOString() };
        setLeads(prev => [newLead, ...prev]);
    };

    const updateTheme = (newTheme) => setTheme(newTheme);

    return (
        <ContentContext.Provider value={{
            profile, updateProfile,
            calculatorConfig, updateCalculator,
            gallery, addGalleryItem, removeGalleryItem, updateGalleryItem,
            visibility, toggleSection,
            leads, addLead,
            theme, updateTheme
        }}>
            {children}
        </ContentContext.Provider>
    );
};
