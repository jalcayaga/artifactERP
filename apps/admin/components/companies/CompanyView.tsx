'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Company, CompanyFilterOptions } from '@artifact/core';
import { CompanyService } from '@artifact/core/client';
import { DataTable } from '@artifact/ui';
import { getColumns } from './CompanyColumns';
import CompanyDetailModal from './CompanyDetailModal';
import CompanyForm from './CompanyForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  ButtonGroup
} from "@material-tailwind/react";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    setShowForm(false);
    setEditingCompany(null);
    fetchCompanies();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <Typography color="red">{error}</Typography>
      </div>
    );
  }

  const title = "Clientes / Proveedores";

  return (
    <div className="mt-4 mb-8 flex flex-col gap-6">
      <DataTable
        title={title}
        description="Administra tus relaciones comerciales en un solo lugar"
        columns={columns}
        data={companies}
        renderActions={
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-between">
            {!show && (
              <ButtonGroup
                variant="text"
                color="blue-gray"
                size="sm"
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <Button
                  className={currentFilterType === 'all' ? "bg-white/5 text-blue-500" : "text-blue-gray-200"}
                  onClick={() => setCurrentFilterType('all')}
                  placeholder=""
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }}
                >Todas</Button>
                <Button
                  className={currentFilterType === 'clients' ? "bg-white/5 text-blue-500" : "text-blue-gray-200"}
                  onClick={() => setCurrentFilterType('clients')}
                  placeholder=""
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }}
                >Clientes</Button>
                <Button
                  className={currentFilterType === 'suppliers' ? "bg-white/5 text-blue-500" : "text-blue-gray-200"}
                  onClick={() => setCurrentFilterType('suppliers')}
                  placeholder=""
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }}
                >Proveedores</Button>
              </ButtonGroup>
            )}
            <Button
              className="flex items-center gap-3 bg-blue-500"
              size="sm"
              onClick={handleAddNewCompany}
              placeholder=""
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }}
            >
              <PlusIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Nuevo</span>
            </Button>
          </div>
        }
      />

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
            <span className="text-gray-400">
              ¿Estás seguro de que quieres eliminar la empresa{" "}
              <strong className="text-white">{companyToDelete.name}</strong>? Esta acción no se puede
              deshacer.
            </span>
          )}
          confirmText="Eliminar"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
          icon={<TrashIcon className="w-5 h-5 mr-2 text-red-500" />}
        />
      )}
    </div>
  );
}
