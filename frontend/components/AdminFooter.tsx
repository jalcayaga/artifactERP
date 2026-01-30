// frontend/components/AdminFooter.tsx
import React from 'react'
import { ERP_APP_NAME } from '@/lib/constants'

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-background text-muted-foreground px-4 sm:px-6 lg:px-8 py-4 text-center text-xs'>
      <p>
        &copy; {currentYear} <span className="text-primary font-semibold">SubRed ERP</span>. Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default AdminFooter
