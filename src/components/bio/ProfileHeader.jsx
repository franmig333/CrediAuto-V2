import { useContent } from '../../context/ContentContext';
import { Phone, CheckCircle2, Facebook, Instagram, Linkedin, Globe, Hash } from 'lucide-react';

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

            {/* Custom Dynamic Fields */}
            {profile.customFields && profile.customFields.length > 0 && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6 text-sm">
                    {profile.customFields.map((field) => (
                        <div key={field.id} className="bg-brand-800/50 p-2 rounded-lg border border-brand-700/50">
                            <span className="block text-accent text-[10px] font-bold uppercase tracking-wider">{field.label}</span>
                            <span className="text-white font-medium">{field.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Social Networks V5 */}
            {profile.socialNetworks && profile.socialNetworks.length > 0 && (
                <div className="flex gap-4 mb-6">
                    {profile.socialNetworks.map((social) => {
                        // Dynamic Icon Map
                        const getIcon = () => {
                            switch (social.platform) {
                                case 'facebook': return <Facebook size={20} />;
                                case 'instagram': return <Instagram size={20} />;
                                case 'linkedin': return <Linkedin size={20} />;
                                case 'tiktok': return <Hash size={20} />; // Using Hash for TikTok as placeholder or specific if available
                                default: return <Globe size={20} />;
                            }
                        };
                        return (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-brand-800 border border-brand-700 flex items-center justify-center text-tech-gray hover:text-white hover:border-accent hover:bg-brand-700 transition-all"
                            >
                                {getIcon()}
                            </a>
                        );
                    })}
                </div>
            )}

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
