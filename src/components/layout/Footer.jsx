import { Link } from 'react-router-dom';
import { ShieldCheck, Facebook, Instagram, Linkedin, Globe, MessageCircle, Hash, Link as LinkIcon } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const Footer = () => {
    const { profile } = useContent();

    return (
        <footer className="bg-brand-800 p-8 text-center border-t border-brand-700 mt-12 mb-safe">
            {/* Social Networks Dynamic */}
            {profile.socialNetworks && profile.socialNetworks.length > 0 && (
                <div className="flex justify-center gap-4 mb-8">
                    {profile.socialNetworks.map((social) => {
                        const getIcon = () => {
                            switch (social.platform) {
                                case 'facebook': return <Facebook size={20} />;
                                case 'instagram': return <Instagram size={20} />;
                                case 'linkedin': return <Linkedin size={20} />;
                                case 'tiktok': return <Hash size={20} />;
                                case 'whatsapp': return <MessageCircle size={20} />;
                                case 'other': return <LinkIcon size={20} />;
                                default: return <Globe size={20} />;
                            }
                        };
                        return (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-brand-900 border border-brand-700 text-tech-gray hover:text-white hover:border-accent hover:bg-brand-800 transition-all flex items-center justify-center"
                            >
                                {getIcon()}
                            </a>
                        );
                    })}
                </div>
            )}

            <p className="text-xs text-tech-gray mb-6">
                &copy; {new Date().getFullYear()} CrediAuto AI. <br /> Tecnología Financiera Inteligente.
            </p>

            <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-700 hover:text-tech-gray transition-colors border border-brand-700/50 px-3 py-1.5 rounded-full"
            >
                <ShieldCheck size={10} className="text-brand-600" /> Admin Access
            </Link>
        </footer>
    );
};
