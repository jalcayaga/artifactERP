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
import { useSupabaseAuth } from './SupabaseAuthContext';

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
  const { user, isLoading: isAuthLoading } = useSupabaseAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanyData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setCompanies([]);
      setActiveCompany(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Determine filter based on user role
      // SUPERADMIN sees ALL companies. ADMIN sees only their own ('mine').
      const userRole = user.user_metadata?.role?.toUpperCase();
      const isSuperAdmin = userRole === 'SUPERADMIN';

      const filter: any = {
        companyOwnership: isSuperAdmin ? 'all' : 'mine'
      };

      console.log(`CompanyContext: Loading companies. Role: ${userRole}, Filter:`, filter);

      const response = await CompanyService.getAllCompanies(1, 1000, filter);
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
    } catch (err: any) {
      console.error("Error loading company data:", err);

      // TEMPORARY: Use mock company data when backend is not available or returns 401
      if (err.status === 401 || err.message?.includes('Unauthorized') || err.message?.includes('No response')) {
        console.warn('Backend not available or unauthorized, using mock company data');
        const mockCompany: Company = {
          id: '5d244541-bf95-4fe5-8bf6-762765c34f08',
          userId: user.id,
          name: 'Artifact Demo',
          fantasyName: 'Artifact',
          rut: '76.123.456-7',
          email: 'demo@artifact.cl',
          phone: '+56 2 2345 6789',
          address: 'Av. Providencia 1234',
          city: 'Santiago',
          isClient: false,
          isSupplier: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCompanies([mockCompany]);
        setActiveCompany(mockCompany);
        localStorage.setItem(COMPANY_STORAGE_KEY, mockCompany.id);
        setError(null); // Clear error since we have mock data
      } else {
        setError('Hubo un error al cargar los datos de la empresa.');
        setCompanies([]);
        setActiveCompany(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
