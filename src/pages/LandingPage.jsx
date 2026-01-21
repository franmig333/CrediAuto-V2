import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { ProfileHeader } from '../components/bio/ProfileHeader';
import { CreditCalculator } from '../components/bio/CreditCalculator';
import { DeliveryGallery } from '../components/bio/DeliveryGallery';
import { PreQualifyForm } from '../components/bio/PreQualifyForm';
import { Footer } from '../components/layout/Footer';

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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
