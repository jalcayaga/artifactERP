import React, { useEffect } from 'react'
import { Company } from '@/lib/types'
import { XIcon, BriefcaseIcon } from '@/components/Icons'
import ContactPeopleView from '@/components/ContactPeopleView' // Added for contact people display

interface CompanyDetailModalProps {
  company: Company | null
  onClose: () => void
}

const DetailItem: React.FC<{
  label: string
  value?: string | React.ReactNode
  icon?: React.FC<{ className?: string }>
}> = ({ label, value, icon: Icon }) => {
  if (
    !value &&
    typeof value !== 'object' &&
    typeof value !== 'boolean' &&
    typeof value !== 'number'
  )
    return null
  return (
    <div className='flex flex-col sm:flex-row sm:items-start py-2'>
      <dt className='w-full sm:w-1/3 text-sm font-medium text-muted-foreground flex items-center'>
        {Icon && <Icon className='w-4 h-4 mr-2 opacity-70' />}
        {label}
      </dt>
      <dd className='w-full sm:w-2/3 mt-1 sm:mt-0 text-sm text-foreground'>
        {value || <span className='italic text-muted-foreground'>N/A</span>}
      </dd>
    </div>
  )
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
}) => {
  useEffect(() => {
    if (!company) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [company, onClose])

  if (!company) {
    return null
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='company-detail-modal-title'
    >
      <div
        className='bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-border'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-4 sm:p-5 border-b border-border'>
          <h2
            id='company-detail-modal-title'
            className='text-lg sm:text-xl font-semibold text-foreground flex items-center'
          >
            <BriefcaseIcon className='w-6 h-6 mr-2 text-primary' />
            {company.name}
          </h2>
          <button
            onClick={onClose}
            className='p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
            aria-label='Cerrar modal'
          >
            <XIcon className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 sm:p-5 space-y-1 overflow-y-auto'>
          <dl className='divide-y divide-border/50'>
            {company.rut && <DetailItem label='RUT' value={company.rut} />}
            {company.giro && <DetailItem label='Giro' value={company.giro} />}
            {company.address && (
              <DetailItem
                label='Dirección'
                value={`${company.address}${company.city ? `, ${company.city}` : ''}${company.state ? `, ${company.state}` : ''}${company.zip ? ` ${company.zip}` : ''}`}
              />
            )}
            {company.phone && (
              <DetailItem label='Teléfono' value={company.phone} />
            )}
            {company.email && (
              <DetailItem label='Email' value={company.email} />
            )}
            <DetailItem
              label='Roles'
              value={
                <div className='flex flex-wrap gap-1'>
                  {company.isClient && (
                    <span className='px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                      Cliente
                    </span>
                  )}
                  {company.isSupplier && (
                    <span className='px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                      Proveedor
                    </span>
                  )}
                </div>
              }
            />
          </dl>

          <div className='pt-4 mt-4 border-t border-border/50'>
            <ContactPeopleView
              companyId={company.id}
              isManagementView={false}
            />
          </div>
        </div>

        <div className='px-4 py-3 sm:px-5 bg-muted/50 border-t border-border flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors'
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailModal
