import React, { useState, useEffect, FormEvent } from 'react'
import {
  ContactPerson,
  CreateContactPersonDto,
  UpdateContactPersonDto,
} from '@/lib/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { UsersIcon } from '@/components/Icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ContactPersonService } from '@/lib/services/contactPersonService'
import countries from '@/lib/countries.json'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ContactPersonFormProps {
  companyId: string
  contactPersonData: ContactPerson | null
  onSave: (contactPerson: ContactPerson) => void
  onCancel: () => void
}

export const ContactPersonForm: React.FC<ContactPersonFormProps> = ({
  companyId,
  contactPersonData,
  onSave,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<any>(countries.find((c: any) => c.cca2 === 'CL') || {})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [role, setRole] = useState<string | undefined>(undefined)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const defaultCountry = countries.find((c: any) => c.cca2 === 'CL') || {};

    if (contactPersonData) {
      setFirstName(contactPersonData.firstName)
      setLastName(contactPersonData.lastName || '')
      setEmail(contactPersonData.email || '')
      setRole(contactPersonData.role || undefined)

      if (contactPersonData.phone) {
        const foundCountry = countries.find((country: any) => {
          const root = country.idd?.root || ''
          const suffixes = country.idd?.suffixes || []
          return suffixes.some((suffix: string) => {
            const fullPrefix = root + suffix
            return contactPersonData.phone && contactPersonData.phone.startsWith(fullPrefix)
          })
        })

        if (foundCountry) {
          setSelectedCountry(foundCountry)
          const root = foundCountry.idd?.root || ''
          const suffix = foundCountry.idd?.suffixes?.[0] || ''
          const fullPrefix = root + suffix
          setPhoneNumber(contactPersonData.phone.substring(fullPrefix.length))
        } else {
          // If no country is found, default to Chile and set phone number as is
          setSelectedCountry(defaultCountry)
          setPhoneNumber(contactPersonData.phone)
        }
      } else {
        setSelectedCountry(defaultCountry)
        setPhoneNumber('')
      }
    } else {
      // Reset form for new contact person
      setFirstName('')
      setLastName('')
      setEmail('')
      setSelectedCountry(defaultCountry)
      setPhoneNumber('')
      setRole(undefined)
    }
    setErrors({})
  }, [contactPersonData])

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido.'
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario.')
      return
    }

    setIsSubmitting(true)
    try {
      const contactPersonDetails: CreateContactPersonDto = {
        companyId,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        phone: selectedCountry && phoneNumber.trim()
          ? `${selectedCountry.idd?.root}${selectedCountry.idd?.suffixes?.[0]}${phoneNumber.trim()}`
          : undefined,
        role: role || undefined,
      }

      let savedContactPerson: ContactPerson
      if (contactPersonData) {
        savedContactPerson = await ContactPersonService.updateContactPerson(
          companyId,
          contactPersonData.id,
          contactPersonDetails as UpdateContactPersonDto
        )
      } else {
        savedContactPerson = await ContactPersonService.createContactPerson(
          companyId,
          contactPersonDetails
        )
      }

      toast.success(
        `Persona de contacto ${savedContactPerson.firstName} guardada exitosamente.`
      )
      onSave(savedContactPerson)
    } catch (error: any) {
      console.error('Error saving contact person:', error)
      toast.error(error.message || 'Error al guardar la persona de contacto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center'>
          <UsersIcon className='w-6 h-6 mr-2 text-primary' />
          {contactPersonData
            ? `Editar: ${contactPersonData.firstName} ${contactPersonData.lastName || ''}`
            : ''}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4 pt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>Nombre</Label>
              <Input
                id='firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Nombre'
                required
              />
              {errors.firstName && (
                <p className='text-red-500 text-sm'>{errors.firstName}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Apellido</Label>
              <Input
                id='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Apellido'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='email@example.com'
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Teléfono</Label>
              <div className='flex space-x-2 items-center'>
                <Select
                  value={selectedCountry ? selectedCountry.cca2 : ''}
                  onValueChange={(value) => {
                    const country = countries.find((c: any) => c.cca2 === value)
                    setSelectedCountry(country)
                  }}
                >
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue placeholder='País'>
                      {selectedCountry && selectedCountry.flags?.svg && (
                        <img
                          src={selectedCountry.flags.svg}
                          alt={`${selectedCountry.name.common} flag`}
                          className='w-5 h-3 mr-2 inline-block'
                        />
                      )}
                      {selectedCountry?.idd?.root}
                      {selectedCountry?.idd?.suffixes?.[0]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country: any) => (
                      <SelectItem key={country.cca2} value={country.cca2}>
                        {country.flags?.svg && (
                          <img
                            src={country.flags.svg}
                            alt={`${country.name.common} flag`}
                            className='w-5 h-3 mr-2 inline-block'
                          />
                        )}
                        {country.name.common} ({country.idd?.root}
                        {country.idd?.suffixes?.[0]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id='phone'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='Teléfono'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='role'>Rol</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value)}
              >
                <SelectTrigger id='role' className='w-full'>
                  <SelectValue placeholder='Seleccionar Rol'>
                    {role || 'Seleccionar Rol'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Ventas'>Ventas</SelectItem>
                  <SelectItem value='Compras'>Compras</SelectItem>
                  <SelectItem value='Contabilidad'>Contabilidad</SelectItem>
                  <SelectItem value='Gerencia'>Gerencia</SelectItem>
                  <SelectItem value='Recursos Humanos'>Recursos Humanos</SelectItem>
                  <SelectItem value='Atención al Cliente'>Atención al Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}