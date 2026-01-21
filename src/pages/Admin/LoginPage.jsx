import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, LogIn } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/admin/dashboard');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
            <div className="bg-brand-800 p-8 rounded-2xl border border-brand-700 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <div className="bg-brand-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="h-8 w-8 text-brand-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Acceso Administrativo</h1>
                    <p className="text-tech-gray text-sm mt-2">Introduce tu clave de acceso segura</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        type="password"
                        placeholder="Contraseña del sistema"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-center tracking-widest text-lg"
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button className="w-full flex justify-center items-center gap-2">
                        Ingresar al Sistema <LogIn size={18} />
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/')} className="text-tech-gray text-sm hover:text-white underline">
                        Volver al sitio público
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
