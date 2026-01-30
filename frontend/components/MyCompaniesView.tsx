// frontend/components/MyCompaniesView.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CompanyService } from '@/lib/services/companyService';
import { Company } from '@/lib/types';
import { DataTable } from '@/components/ui/DataTable';
import { getColumns } from '@/components/CompanyColumns';
import { Button } from '@/components/ui/button';
import CompanyForm from '@/components/CompanyForm';
import { PlusIcon } from '@/components/Icons';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function MyCompaniesView() {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const fetchMyCompanies = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await CompanyService.getAllCompanies(1, 1000, { companyOwnership: 'mine' });
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching my companies:", err);
      setError('Error al cargar tus empresas.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMyCompanies();
  }, [fetchMyCompanies]);

  const handleAddNewCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleSaveCompany = async () => {
    setShowForm(false);
    setEditingCompany(null);
    await fetchMyCompanies(); // Reload companies after save
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  // Columns for the table, without the delete action
  const columns = useMemo(() => getColumns(handleEdit, () => {}, () => {}, 'my-companies'), [handleEdit]);

  if (loading) return <div>Cargando tus empresas...</div>;
  if (error) return <div>{error}</div>;

  if (showForm) {
    return (
      <CompanyForm
        companyData={editingCompany}
        onSave={handleSaveCompany}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Empresas</h1>
        <Button onClick={handleAddNewCompany}>
          <PlusIcon className="w-4 h-4 mr-2" /> Crear Nueva Empresa
        </Button>
      </div>
      {companies.length === 0 && !loading && !error ? (
        <div className="text-center py-12 px-4">
          <h3 className="mt-3 text-xl font-semibold text-foreground">
            No tienes empresas registradas.
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Comienza creando tu primera empresa.
          </p>
          <div className="mt-6">
            <Button type="button" onClick={handleAddNewCompany}>
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Crear Primera Empresa</span>
            </Button>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={companies} />
      )}
    </div>
  );
}
