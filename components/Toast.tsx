
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let bgColor = 'bg-blue-500';
  let Icon = Info;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      Icon = CheckCircle;
      break;
    case 'error':
      bgColor = 'bg-red-500';
      Icon = XCircle;
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      Icon = AlertCircle;
      break;
    case 'info':
    default:
      bgColor = 'bg-purple-600'; // Using purple for general info as per theme
      Icon = Info;
      break;
  }

  return (
    <div 
      className={`fixed bottom-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-xl flex items-center space-x-3 z-[100] transition-transform transform animate-slide-in-right`}
      style={{ animation: 'slideInRight 0.5s ease-out forwards, fadeOut 0.5s ease-in 2.5s forwards' }}
    >
      <Icon size={24} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto -mr-1 p-1 hover:bg-white/20 rounded-full">
        <XCircle size={20} />
      </button>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; transform: translateX(100%); }
        }
        .animate-slide-in-right {
          animation-name: slideInRight, fadeOut;
          animation-duration: 0.5s, 0.5s;
          animation-timing-function: ease-out, ease-in;
          animation-delay: 0s, 2.5s; /* FadeOut starts after 2.5s */
          animation-fill-mode: forwards, forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
