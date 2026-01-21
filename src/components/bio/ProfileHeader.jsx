import { useContent } from '../../context/ContentContext';
import { Phone, CheckCircle2 } from 'lucide-react';

export const ProfileHeader = () => {
    const { profile } = useContent();

    return (
        <div className="flex flex-col items-center pt-10 pb-8 px-4 text-center">
            <div className="relative mb-6 group">
                <div className="absolute -inset-1 bg-accent-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img
                    src={profile.photo}
                    alt={profile.name}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-accent shadow-2xl"
                />
                <div className="absolute bottom-0 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-brand-900"></div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
            <p className="text-accent font-medium mb-3">{profile.title}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {profile.badges.map((badge, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-800 border border-brand-700 text-xs text-tech-gray">
                        <CheckCircle2 size={12} className="text-accent" /> {badge}
                    </span>
                ))}
            </div>

            <a
                href={`https://wa.me/${profile.phone}?text=Hola, vengo de tu perfil.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-tech-gray text-sm hover:text-white transition-colors"
            >
                <Phone size={14} /> {profile.phone}
            </a>
        </div>
    );
};
