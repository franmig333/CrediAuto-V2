import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { ProfileHeader } from '../components/bio/ProfileHeader';
import { CreditCalculator } from '../components/bio/CreditCalculator';
import { DeliveryGallery } from '../components/bio/DeliveryGallery';
import { PreQualifyForm } from '../components/bio/PreQualifyForm';

const LandingPage = () => {
    const { visibility } = useContent();

    return (
        <div className="min-h-screen bg-brand-900 text-tech-white max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-brand-800">

            {/* Bio Header */}
            <ProfileHeader />

            {/* Main Content */}
            <main className="space-y-4">
                {visibility.calculator && <CreditCalculator />}
                {visibility.gallery && <DeliveryGallery />}
                {visibility.form && <PreQualifyForm />}
            </main>

            {/* Footer with Admin Access */}
            <footer className="bg-brand-800 p-8 text-center border-t border-brand-700 mt-12 mb-safe">
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
        </div>
    );
};

export default LandingPage;
