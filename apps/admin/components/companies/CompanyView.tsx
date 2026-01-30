'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CompanyService, Company, CreateCompanyDto, UpdateCompanyDto, CompanyFilterOptions } from '@artifact/core';
import { DataTable } from '@artifact/ui'; // Será migrado
import { getColumns } from './CompanyColumns'; // En la misma carpeta
import { Input } from '@artifact/ui'; // Será migrado
import { Button } from '@artifact/ui'; // Será migrado
import CompanyDetailModal from './CompanyDetailModal'; // En la misma carpeta
import CompanyForm from './CompanyForm'; // En la misma carpeta
import ConfirmationModal from '@/components/common/ConfirmationModal'; // Será migrado a common
import { PlusIcon, TrashIcon } from '@artifact/ui';

interface CompanyViewProps {
  show?: 'clients' | 'suppliers';
}

export default function CompanyView({ show }: CompanyViewProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilterType, setCurrentFilterType] = useState<'all' | 'clients' | 'suppliers'>(() =>
    show === 'clients' ? 'clients' : show === 'suppliers' ? 'suppliers' : 'all'
  );

  // State for modals
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let filters: CompanyFilterOptions = { companyOwnership: 'others' };

      if (show === 'clients') {
        filters = { ...filters, isClient: true };
      } else if (show === 'suppliers') {
        filters = { ...filters, isSupplier: true };
      } else {
        if (currentFilterType === 'clients') {
          filters = { ...filters, isClient: true };
        } else if (currentFilterType === 'suppliers') {
          filters = { ...filters, isSupplier: true };
        }
      }

      const response = await CompanyService.getAllCompanies(1, 1000, filters);
      setCompanies(response.data);
    } catch (err) {
      setError('Error al cargar las empresas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [show, currentFilterType]);

  const handleAddNewCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDeleteRequest = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
      try {
        await CompanyService.deleteCompany(companyToDelete.id);
        fetchCompanies(); // Refresh data
        setShowDeleteConfirmModal(false);
        setCompanyToDelete(null);
      } catch (err) {
        setError('Error al eliminar la empresa.');
      }
    }
  };

  const handleView = (company: Company) => {
    setViewingCompany(company);
  };

  const handleSaveCompany = async (savedCompany: Company) => {
    try {
      // The CompanyForm already handles the creation/update logic and returns the saved Company
      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies(); // Refresh data
    } catch (err) {
      setError('Error al guardar la empresa.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleCloseDetailModal = () => {
    setViewingCompany(null);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setCompanyToDelete(null);
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDeleteRequest, handleView), []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const title = show === 'clients' ? 'Clientes' : show === 'suppliers' ? 'Proveedores' : 'Clientes y Proveedores';

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={handleAddNewCompany}>
          <PlusIcon className="w-4 h-4 mr-2" /> Nuevo Cliente/Proveedor
        </Button>
      </div>

      {!show && (
        <div className="flex space-x-2 mb-4">
          <Button
            variant={currentFilterType === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentFilterType('all')}
          >
            Todas
          </Button>
          <Button
            variant={currentFilterType === 'clients' ? 'default' : 'outline'}
            onClick={() => setCurrentFilterType('clients')}
          >
            Clientes
          </Button>
          <Button
            variant={currentFilterType === 'suppliers' ? 'default' : 'outline'}
            onClick={() => setCurrentFilterType('suppliers')}
          >
            Proveedores
          </Button>
        </div>
      )}

      <DataTable columns={columns} data={companies} />

      {viewingCompany && (
        <CompanyDetailModal
          company={viewingCompany}
          onClose={handleCloseDetailModal}
        />
      )}

      {showForm && (
        <CompanyForm
          companyData={editingCompany}
          onSave={handleSaveCompany}
          onCancel={handleCloseForm}
        />
      )}

      {showDeleteConfirmModal && companyToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message={(
            <>
              ¿Estás seguro de que quieres eliminar la empresa{" "}
              <strong>{companyToDelete.name}</strong>? Esta acción no se puede
              deshacer.
            </>
          )}
          confirmText="Eliminar"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </div>
  );
}
