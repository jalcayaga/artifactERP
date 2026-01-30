'use client'

import React, { useState } from 'react'
import { Company } from '@/lib/types'
import CompanyForm from './CompanyForm'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useRouter } from 'next/navigation'

type Step =
  | 'welcome'
  | 'create_company'
  | 'ask_client'
  | 'create_client'
  | 'ask_supplier'
  | 'create_supplier'
  | 'finished'

export default function SetupWizard() {
  const [step, setStep] = useState<Step>('welcome')
  const [myCompany, setMyCompany] = useState<Company | null>(null)
  const router = useRouter()

  const handleCompanySave = (company: Company) => {
    if (step === 'create_company') {
      setMyCompany(company)
      setStep('ask_client')
    }
    if (step === 'create_client') {
      setStep('ask_supplier')
    }
    if (step === 'create_supplier') {
      setStep('finished')
    }
  }

  const handleCancel = () => {
    // For now, just log it. In a real scenario, we might want to ask for confirmation.
    console.log('Setup cancelled')
    router.push('/admin/dashboard') // Redirect to dashboard
  }

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido al Asistente de Configuración</CardTitle>
              <CardDescription>
                Vamos a configurar tu espacio de trabajo en SubRed ERP.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                En los siguientes pasos, crearás tu primera empresa y,
                opcionalmente, registrarás tus primeros clientes y proveedores.
              </p>
              <Button onClick={() => setStep('create_company')} className="mt-4">
                Comenzar
              </Button>
            </CardContent>
          </Card>
        )
      case 'create_company':
        return (
          <CompanyForm
            companyData={null}
            onSave={handleCompanySave}
            onCancel={handleCancel}
            isMyCompanyForm={true}
          />
        )
      case 'ask_client':
        return (
          <Card>
            <CardHeader>
              <CardTitle>¡Excelente! Tu empresa ha sido creada.</CardTitle>
              <CardDescription>
                ¿Quieres añadir tu primer cliente ahora?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={() => setStep('create_client')}>
                Sí, añadir cliente
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('ask_supplier')}
              >
                No, saltar por ahora
              </Button>
            </CardContent>
          </Card>
        )
      case 'create_client':
        return (
          <CompanyForm
            companyData={null}
            onSave={handleCompanySave}
            onCancel={() => setStep('ask_supplier')} // Go to next step on cancel
            defaultRole="client"
          />
        )
      case 'ask_supplier':
        return (
          <Card>
            <CardHeader>
              <CardTitle>¿Quieres añadir tu primer proveedor?</CardTitle>
              <CardDescription>
                Puedes registrar un proveedor para empezar a gestionar tus
                compras.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={() => setStep('create_supplier')}>
                Sí, añadir proveedor
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('finished')}
              >
                No, finalizar configuración
              </Button>
            </CardContent>
          </Card>
        )
      case 'create_supplier':
        return (
          <CompanyForm
            companyData={null}
            onSave={handleCompanySave}
            onCancel={() => setStep('finished')} // Go to next step on cancel
            defaultRole="supplier"
          />
        )
      case 'finished':
        return (
          <Card>
            <CardHeader>
              <CardTitle>¡Configuración completada!</CardTitle>
              <CardDescription>
                Has configurado los elementos básicos para empezar a trabajar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/admin/dashboard')}>
                Ir al Dashboard
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return <div>Paso desconocido</div>
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      {renderStep()}
    </div>
  )
}
