// frontend/components/UserDetailModal.tsx
import React, { useEffect } from 'react';
import { User } from '@/lib/types';
import { XIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon, CalendarIcon } from '@/components/Icons';

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | boolean | React.ReactNode; icon?: React.FC<{className?: string}> }> = ({ label, value, icon: Icon }) => {
  let displayValue: React.ReactNode;

  if (typeof value === 'boolean') {
    displayValue = value ? 
        <span className="flex items-center text-emerald-600 dark:text-emerald-400"><CheckCircleIcon className="w-4 h-4 mr-1.5" /> Activo</span> : 
        <span className="flex items-center text-amber-600 dark:text-amber-400"><XCircleIcon className="w-4 h-4 mr-1.5" /> Inactivo</span>;
  } else if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    displayValue = <span className="italic text-muted-foreground">N/A</span>;
  } else {
    displayValue = value;
  }
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      <dt className="w-full sm:w-2/5 md:w-1/3 text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 opacity-70 flex-shrink-0" />}
        {label}
      </dt>
      <dd className="w-full sm:w-3/5 md:w-2/3 mt-1 sm:mt-0 text-sm text-foreground break-words">
        {displayValue}
      </dd>
    </div>
  );
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  useEffect(() => {
    if (!user) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [user, onClose]);

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-detail-modal-title"
    >
      <div
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
            <div className="flex items-center">
                 <UserCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mr-3 sm:mr-4" />
                <div>
                    <h2 id="user-detail-modal-title" className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
            </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ml-2"
            aria-label="Cerrar modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-1 overflow-y-auto">
          <dl className="divide-y divide-border/50">
            <DetailItem label="ID Usuario" value={user.id.substring(0,12)+'...'} />
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Estado" value={user.isActive} />
            {user.lastLogin && <DetailItem label="Último Inicio de Sesión" value={new Date(user.lastLogin).toLocaleString()} icon={CalendarIcon}/>}
          </dl>
        </div>

        <div className="px-4 py-3 sm:px-5 bg-muted/50 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;