import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
    // --- STATE ---
    const [profile, setProfile] = useState(defaultProfile);
    const [calculatorConfig, setCalculatorConfig] = useState(defaultCalculator);
    const [gallery, setGallery] = useState(defaultGallery);
    const [visibility, setVisibility] = useState(defaultVisibility);
    const [leads, setLeads] = useState([]); // Loads dynamically, no default needed
    const [theme, setTheme] = useState(defaultTheme);

    const [loading, setLoading] = useState(true);
    const [rowId, setRowId] = useState(null); // V5: Dynamic ID

    // --- SUPABASE FETCH (Array Fix) ---
    useEffect(() => {
        const fetchContent = async () => {
            try {
                // 1. Fetch any existing config (Limit 1, Returns Array)
                let { data: response, error } = await supabase
                    .from('site_content')
                    .select('id, data')
                    .limit(1);

                if (error) {
                    console.error('Error fetching content:', error);
                }

                if (response && response.length > 0) {
                    const row = response[0];
                    setRowId(row.id); // Save ID for updates

                    const dbData = row.data || {};
                    console.log('✅ DATA ENCONTRADA (Array [0]):', dbData);

                    // Unpack logic (Handle flat or nested)
                    const content = dbData.theme ? dbData : (dbData.data || dbData);

                    if (content.profile) setProfile(prev => ({ ...prev, ...content.profile }));
                    if (content.calculatorConfig) setCalculatorConfig(prev => ({ ...prev, ...content.calculatorConfig }));
                    if (content.gallery) setGallery(content.gallery);
                    if (content.visibility) setVisibility(prev => ({ ...prev, ...content.visibility }));
                    if (content.theme) setTheme(prev => ({ ...prev, ...content.theme }));
                }

                // 2. Fetch Leads (Admin view)
                const { data: leadsData } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (leadsData) {
                    const formattedLeads = leadsData.map(l => ({
                        id: l.id,
                        date: l.created_at,
                        name: l.client_name,
                        carInterest: l.details?.term ? `Plazo: ${l.details.term}m` : 'Interesado', // Simplify or extract from details
                        income: l.income,
                        ...l.details
                    }));
                    setLeads(formattedLeads);
                }

            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    // --- SAVE TO SUPABASE (Correct Nesting) ---
    const pushToSupabase = async (updatedData) => {
        // We fetch current full state from state variables? No, they might be stale in closure.
        // We will construct the "master object" dynamically based on what's changed.

        // Actually, best approach for this "JSON blob" architecture:
        // Use a ref or just rely on the fact that Admin saves explicitly via buttons.
        // The user edits form state in Dashboard, then clicks "Save".
        // Dashboard calls `updateProfile`. `updateProfile` updates context state AND should save to DB.

        // Combining current profile + updates.
        const fullContent = {
            profile: { ...profile, ...(updatedData.profile || {}) },
            calculatorConfig: { ...calculatorConfig, ...(updatedData.calculatorConfig || {}) },
            gallery: updatedData.gallery || gallery,
            visibility: { ...visibility, ...(updatedData.visibility || {}) },
            theme: { ...theme, ...(updatedData.theme || {}) }
        };

        if (rowId) {
            // UPDATE using Dynamic ID
            const { error } = await supabase
                .from('site_content')
                .update({ data: fullContent }) // Save FLAT structure into 'data' column
                .eq('id', rowId);

            if (error) console.error('Error updating Supabase:', error);
        } else {
            // INSERT new row
            const { data, error } = await supabase
                .from('site_content')
                .insert([{ data: fullContent }])
                .select()
                .single();

            if (error) {
                console.error('Error inserting to Supabase:', error);
            } else if (data) {
                setRowId(data.id);
            }
        }
    };

    // --- ACTIONS ---
    const updateProfile = (data) => {
        setProfile(prev => {
            const newVal = { ...prev, ...data };
            pushToSupabase({ profile: newVal }); // Sync
            return newVal;
        });
    };

    const updateCalculator = (data) => {
        setCalculatorConfig(prev => {
            const newVal = { ...prev, ...data };
            pushToSupabase({ calculatorConfig: newVal });
            return newVal;
        });
    };

    const toggleSection = (section) => {
        setVisibility(prev => {
            const newVal = { ...prev, [section]: !prev[section] };
            pushToSupabase({ visibility: newVal });
            return newVal;
        });
    };

    // Gallery is tricky because of arrays.
    const addGalleryItem = (url, caption, title) => {
        setGallery(prev => {
            const newVal = [...prev, { id: Date.now(), image: url, caption, title }];
            pushToSupabase({ gallery: newVal });
            return newVal;
        });
    };

    const removeGalleryItem = (id) => {
        setGallery(prev => {
            const newVal = prev.filter(item => item.id !== id);
            pushToSupabase({ gallery: newVal });
            return newVal;
        });
    };

    const updateGalleryItem = (id, updates) => {
        setGallery(prev => {
            const newVal = prev.map(item => item.id === id ? { ...item, ...updates } : item);
            pushToSupabase({ gallery: newVal });
            return newVal;
        });
    };

    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        pushToSupabase({ theme: newTheme });
    };

    const addLead = async (leadData) => {
        // This is for local optimistic update if needed, but mainly now handled by Form directly inserting.
        // BUT if we want leads in Admin to update live:
        const { data, error } = await supabase.from('leads').insert([{
            client_name: leadData.name,
            client_id: 'WEB-' + Date.now(), // Generate a basic ID or use Phone
            income: leadData.income,
            details: leadData
        }]).select().single();

        if (data) {
            setLeads(prev => [{
                id: data.id,
                date: data.created_at,
                name: data.client_name,
                income: data.income,
                ...data.details
            }, ...prev]);
        }
    };

    // Theme Variable Application (Local effect still needed for CSS vars)
    useEffect(() => {
        if (!theme) return;
        const root = document.documentElement;

        // V5: Robust mapping (Supports both 'bg' and 'background', 'accent' and 'primary')
        const bg = theme.bg || theme.background || defaultTheme.bg;
        const card = theme.card || defaultTheme.card;
        const text = theme.text || defaultTheme.text;
        const accent = theme.accent || theme.primary || defaultTheme.accent;

        console.log('🎨 PINTANDO UI:', { bg, card, text, accent });

        root.style.setProperty('--color-bg', bg);
        root.style.setProperty('--color-card', card);
        root.style.setProperty('--color-text', text);

        root.style.setProperty('--color-accent', accent);
        root.style.setProperty('--color-accent-hover', accent); // Simple mapping
        root.style.setProperty('--color-accent-glow', `${accent}80`); // Add transparency
    }, [theme]);

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
