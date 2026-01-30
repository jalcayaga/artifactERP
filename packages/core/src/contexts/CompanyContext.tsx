'use client';

// contexts/CompanyContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Company } from '../lib/types';
import { CompanyService } from '../lib/services/companyService';
import { useAuth } from './AuthContext';

const COMPANY_STORAGE_KEY = 'wolfflow_selectedCompanyId';

interface CompanyContextType {
  companies: Company[];
  activeCompany: Company | null;
  switchCompany: (companyId: string) => void;
  isLoading: boolean;
  error: string | null;
  reloadCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanyData = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      setCompanies([]);
      setActiveCompany(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request only companies owned by the current user
      const response = await CompanyService.getAllCompanies(1, 1000, { companyOwnership: 'mine' });
      const userCompanies = response.data;
      setCompanies(userCompanies);

      if (userCompanies.length === 0) {
        setError('No estás asociado a ninguna empresa.');
        setActiveCompany(null);
        localStorage.removeItem(COMPANY_STORAGE_KEY);
      } else {
        const storedCompanyId = localStorage.getItem(COMPANY_STORAGE_KEY);
        let companyToActivate = userCompanies.find(c => c.id === storedCompanyId) || userCompanies[0];
        
        setActiveCompany(companyToActivate);
        localStorage.setItem(COMPANY_STORAGE_KEY, companyToActivate.id);
      }
    } catch (err) {
      console.error("Error loading company data:", err);
      setError('Hubo un error al cargar los datos de la empresa.');
      setCompanies([]);
      setActiveCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isAuthLoading) {
      loadCompanyData();
    }
  }, [isAuthLoading, loadCompanyData]);

  const switchCompany = useCallback(
    (companyId: string) => {
      const newActiveCompany = companies.find((c) => c.id === companyId);
      if (newActiveCompany) {
        setActiveCompany(newActiveCompany);
        localStorage.setItem(COMPANY_STORAGE_KEY, newActiveCompany.id);
        window.location.reload();
      } else {
        console.warn("Intento de cambiar a una empresa no válida");
      }
    },
    [companies]
  );

  const value = {
    companies,
    activeCompany,
    switchCompany,
    isLoading,
    error,
    reloadCompanies: loadCompanyData,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany debe ser usado dentro de un CompanyProvider');
  }
  return context;
};
