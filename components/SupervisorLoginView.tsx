
import React, { useState } from 'react';
import { LogIn, ArrowLeftCircle, ShieldCheck } from 'lucide-react';

interface SupervisorLoginViewProps {
  onLogin: (success: boolean) => void;
  onNavigateToClientView: () => void;
}

const SupervisorLoginView: React.FC<SupervisorLoginViewProps> = ({ onLogin, onNavigateToClientView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate authentication
    if (username === 'fakhabib' && password === 'Leprince') {
      onLogin(true);
    } else {
      setError('Identifiants incorrects. Essayez "fakhabib" et "Leprince".');
      onLogin(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-zinc-800">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl shadow-2xl space-y-6">
        <div className="text-center">
            <ShieldCheck size={60} className="mx-auto text-purple-500 mb-4" />
            <h2 className="text-3xl font-bold text-purple-400">Accès Superviseur</h2>
            <p className="text-gray-400 mt-1">Connectez-vous pour gérer les appareils.</p>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              placeholder="Ex: fakhabib"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              placeholder="Ex: Leprince"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <LogIn size={20} />
            <span>Se Connecter</span>
          </button>
        </form>
        <button
            onClick={onNavigateToClientView}
            className="w-full mt-4 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
            <ArrowLeftCircle size={20} />
            <span>Retour à l'écran client</span>
        </button>
      </div>
       <footer className="text-xs text-gray-500 pt-8">
          VERRAPP Web v1.0.0 - Supervisor Panel
        </footer>
    </div>
  );
};

export default SupervisorLoginView;
