import React, { useState, useEffect, FormEvent } from 'react';
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  ContactPerson,
  CompanyService,
  ContactPersonService,
  useAuth,
  validateRut,
  chileanRegions,
  countries,
} from '@artifact/core';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@artifact/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@artifact/ui';
import { BriefcaseIcon, UsersIcon as UserIcon } from '@artifact/ui';
import { Input } from '@artifact/ui';
import { Label } from '@artifact/ui';
import { Button } from '@artifact/ui';
import { toast } from 'sonner';
import { Checkbox } from '@artifact/ui'; // Será migrado
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@artifact/ui';
import ContactPeopleManagement from './ContactPeopleManagement'; // Será migrado

interface CompanyFormProps {
  companyData: Company | null;
  onSave: (company: Company) => void;
  onCancel: () => void;
  isMyCompanyForm?: boolean; // New prop to distinguish form usage
  defaultRole?: 'client' | 'supplier';
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  companyData,
  onSave,
  onCancel,
  isMyCompanyForm = false, // Default to false
  defaultRole = 'client',
}) => {
  const { token, currentUser } = useAuth();

  // Company fields
  const [fantasyName, setFantasyName] = useState('');
  const [isClient, setIsClient] = useState(false); // Default to false
  const [isSupplier, setIsSupplier] = useState(false); // Default to false

  // Billing fields
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [giro, setGiro] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [zip, setZip] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(countries.find((c: any) => c.cca2 === 'CL') || {});
  const [phoneNumber, setPhoneNumber] = useState('');

  // Contact Person fields (for new company creation)
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactPeopleModal, setShowContactPeopleModal] = useState(false);

  useEffect(() => {
    const defaultCountry = countries.find((c: any) => c.cca2 === 'CL') || {};

    if (companyData) {
      setFantasyName(companyData.fantasyName || '');
      setRazonSocial(companyData.name);
      setRut(companyData.rut || '');
      setGiro(companyData.giro || '');
      setAddress(companyData.address || '');
      setComuna(companyData.city || '');
      setEmail(companyData.email || '');
      const regionFound = chileanRegions.regiones.find(
        (r) => r.region === companyData.state
      );
      setSelectedRegion(regionFound ? regionFound.region : '');
      setZip(companyData.zip || '');

      if (companyData.phone) {
        const foundCountry = countries.find((country: any) => {
          const root = country.idd?.root || '';
          const suffixes = country.idd?.suffixes || [];
          return suffixes.some((suffix: string) => {
            const fullPrefix = root + suffix;
            return companyData.phone && companyData.phone.startsWith(fullPrefix);
          });
        });

        if (foundCountry) {
          setSelectedCountry(foundCountry);
          const root = foundCountry.idd?.root || '';
          const suffix = foundCountry.idd?.suffixes?.[0] || '';
          const fullPrefix = root + suffix;
          setPhoneNumber(companyData.phone.substring(fullPrefix.length));
        } else {
          setSelectedCountry(defaultCountry);
          setPhoneNumber(companyData.phone);
        }
      } else {
        setSelectedCountry(defaultCountry);
        setPhoneNumber('');
      }

      setIsClient(companyData.isClient);
      setIsSupplier(companyData.isSupplier);
      setContactFirstName('');
      setContactLastName('');
      setContactEmail('');
      setContactPhone('');
    } else {
      setFantasyName('');
      setRazonSocial('');
      setRut('');
      setGiro('');
      setAddress('');
      setSelectedRegion('');
      setComuna('');
      setZip('');
      setEmail('');
      setSelectedCountry(defaultCountry);
      setPhoneNumber('');
      if (isMyCompanyForm) {
        setIsClient(false);
        setIsSupplier(false);
      } else {
        if (defaultRole === 'client') {
          setIsClient(true);
          setIsSupplier(false);
        } else if (defaultRole === 'supplier') {
          setIsClient(false);
          setIsSupplier(true);
        }
      }
      setContactFirstName('');
      setContactLastName('');
      setContactEmail('');
      setContactPhone('');
      setContactRole('');
    }
    setErrors({});
  }, [companyData, token, isMyCompanyForm, defaultRole]);

  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    let formatted = '';
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    } else {
      formatted = cleaned;
    }
    return formatted;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRut(formatRut(value));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!fantasyName.trim())
      newErrors.fantasyName = 'El nombre de fantasía es requerido.';

    if (!razonSocial.trim())
      newErrors.razonSocial = 'La razón social es requerida.';

    if (!email.trim()) {
      newErrors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del email no es válido.';
    }

    if (!rut.trim()) {
      newErrors.rut = 'El RUT es requerido.';
    } else if (!validateRut(rut)) {
      newErrors.rut = 'El formato del RUT no es válido.';
    }

    if (!giro.trim()) newErrors.giro = 'El giro es requerido.';
    if (!address.trim()) newErrors.address = 'La dirección es requerida.';
    if (!comuna.trim()) newErrors.comuna = 'La comuna es requerida.';
    if (!selectedRegion.trim()) newErrors.selectedRegion = 'La región es requerida.';

    if (!selectedCountry) newErrors.selectedCountry = 'El país es requerido.';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'El número de teléfono es requerido.';

    if (!isMyCompanyForm && !isClient && !isSupplier)
      newErrors.roles =
        'Debe seleccionar al menos un rol (Cliente o Proveedor).';

    if (!companyData) {
      if (!contactFirstName.trim())
        newErrors.contactFirstName = 'El nombre del contacto es requerido.';
      if (!contactEmail.trim())
        newErrors.contactEmail = 'El email del contacto es requerido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario.');
      return;
    }

    if (!currentUser?.id) {
      toast.error('No se pudo determinar el usuario actual.');
      return;
    }

    setIsSubmitting(true);
    try {
      const companyDetails: CreateCompanyDto = {
        name: razonSocial.trim(),
        fantasyName: fantasyName.trim(),
        rut: rut.trim() || undefined,
        giro: giro.trim() || undefined,
        address: address.trim() || undefined,
        city: comuna.trim() || undefined,
        state: selectedRegion.trim() || undefined,
        zip: zip.trim() || undefined,
        email: email.trim(),
        phone: selectedCountry && phoneNumber.trim()
          ? `${selectedCountry.idd?.root}${selectedCountry.idd?.suffixes?.[0]}${phoneNumber.trim()}`
          : undefined,
        isClient: isMyCompanyForm ? false : isClient,
        isSupplier: isMyCompanyForm ? false : isSupplier,
      };

      let savedCompany: Company;
      if (companyData) {
        savedCompany = await CompanyService.updateCompany(
          companyData.id,
          companyDetails as UpdateCompanyDto
        );
      } else {
        savedCompany = await CompanyService.createCompany(companyDetails);

        if (contactFirstName.trim() && contactEmail.trim()) {
          const contactPersonPayload = {
            companyId: savedCompany.id,
            firstName: contactFirstName.trim(),
            lastName: contactLastName.trim() || undefined,
            email: contactEmail.trim(),
            phone: contactPhone.trim() || undefined,
          };
          await ContactPersonService.createContactPerson(
            savedCompany.id,
            contactPersonPayload
          );
        }
      }

      toast.success(`Empresa ${savedCompany.name} guardada exitosamente.`);
      onSave(savedCompany);
    } catch (error: any) {
      console.error('Error saving company:', error);
      if (error.response && error.response.status === 409) {
        toast.error(
          error.response.data.message ||
            'Ya existe una empresa con el mismo RUT o email.'
        );
      } else {
        toast.error(error.message || 'Error al guardar la empresa.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    'mt-1 block w-full px-3 py-2 rounded-md shadow-sm text-sm transition-colors duration-150 bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <Card className='max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl flex items-center'>
          <BriefcaseIcon className='w-6 h-6 mr-2 text-primary' />
          {companyData
            ? `Editar: ${companyData.fantasyName || companyData.name}`
            : isMyCompanyForm ? 'Crear Mi Empresa' : 'Crear Cliente o Proveedor'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-6 pt-6'>
          {/* Section: General Info */}
          <div className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <Label htmlFor='fantasy-name'>
                  Nombre de fantasía <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  id='fantasy-name'
                  value={fantasyName}
                  onChange={(e) => setFantasyName(e.target.value)}
                  className={inputBaseClass}
                  placeholder='Ej: Mi Empresa S.A.'
                />
                {errors.fantasyName && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.fantasyName}
                  </p>
                )}
                <p className='text-xs text-muted-foreground mt-1'>
                  Si no existe el nombre de fantasía puede usar algún nombre
                  representativo.
                </p>
              </div>
              {!isMyCompanyForm && ( // Conditionally render checkboxes
                <div className='flex items-center space-x-4 pt-6'>
                  <div className='flex items-center'>
                    <Checkbox
                      id='is-client'
                      checked={isClient}
                      onCheckedChange={(checked) => setIsClient(!!checked)}
                      className="data-[state=checked]:text-black"
                    />
                    <Label
                      htmlFor='is-client'
                      className='ml-2 text-sm font-medium text-foreground'
                    >
                      Es Cliente
                    </Label>
                  </div>
                  <div className='flex items-center'>
                    <Checkbox
                      id='is-supplier'
                      checked={isSupplier}
                      onCheckedChange={(checked) => setIsSupplier(!!checked)}
                      className="data-[state=checked]:text-black"
                    />
                    <Label
                      htmlFor='is-supplier'
                      className='ml-2 text-sm font-medium text-foreground'
                    >
                      Es Proveedor
                    </Label>
                  </div>
                  {errors.roles && (
                    <p className='text-xs text-destructive'>{errors.roles}</p>
                  )}
                </div>
              )}
            </div>
            {/* Contact Person Fields - Only for new company creation */}
            {!companyData && (
              <div className='mt-6 space-y-5'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Contacto Principal <span className='text-red-500'>*</span>
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <Label htmlFor='contact-first-name'>
                      Nombre <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      type='text'
                      id='contact-first-name'
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      className={inputBaseClass}
                    />
                    {errors.contactFirstName && (
                      <p className='text-xs text-destructive mt-1'>
                        {errors.contactFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='contact-last-name'>Apellido</Label>
                    <Input
                      type='text'
                      id='contact-last-name'
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <Label htmlFor='contact-email'>
                      Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      type='email'
                      id='contact-email'
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={inputBaseClass}
                    />
                    {errors.contactEmail && (
                      <p className='text-xs text-destructive mt-1'>
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                  <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div>
                      <Label htmlFor='contact-phone'>Teléfono</Label>
                      <Input
                        type='tel'
                        id='contact-phone'
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <Label htmlFor='contact-role'>Rol</Label>
                      <Select
                        value={contactRole}
                        onValueChange={(value) => setContactRole(value)}
                      >
                        <SelectTrigger id='contact-role' className='w-full'>
                          <SelectValue placeholder='Seleccionar Rol'>
                            {contactRole || 'Seleccionar Rol'}
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
                </div>
              </div>
            )}
            {companyData && (
              <div className='mt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowContactPeopleModal(true)}
                >
                  <UserIcon className='w-4 h-4 mr-2' /> Gestionar Contactos
                </Button>
              </div>
            )}
          </div>

          {/* Section: Billing Data */}
          <div className='mt-6 space-y-5'>
            <h3 className='text-lg font-semibold text-foreground'>
              Datos de facturación
            </h3>
            <p className='text-sm text-muted-foreground'>
              Si existen más datos de facturación, puede ingresarlos luego de
              crear al cliente/proveedor, en la pantalla Modificar.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <Label>País</Label>
                <Input
                  type='text'
                  value='CHILE'
                  disabled
                  className={`${inputBaseClass} bg-muted/50`}
                />
              </div>
              <div>
                <Label htmlFor='company-rut'>
                  RUT Cliente/Proveedor <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  id='company-rut'
                  value={rut}
                  onChange={handleRutChange}
                  className={inputBaseClass}
                  placeholder='Ej: 12.345.678-9'
                />
                {errors.rut && (
                  <p className='text-xs text-destructive mt-1'>{errors.rut}</p>
                )}
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='company-name'>
                  Nombre o Razón Social <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  id='company-name'
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className={inputBaseClass}
                  placeholder='Ej: Mi Empresa S.A.'
                />
                {errors.razonSocial && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.razonSocial}
                  </p>
                )}
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='company-email'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='email'
                  id='company-email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBaseClass}
                  placeholder='Ej: contacto@empresa.com'
                />
                {errors.email && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.email}
                  </p>
                )}
              </div>
              <div className='md:col-span-2'>
                <Label htmlFor='company-address'>
                  Dirección <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  id='company-address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputBaseClass}
                  placeholder='Ej: Av. Siempre Viva 742'
                />
                {errors.address && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor='company-region'>
                  Región <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => {
                    setSelectedRegion(value);
                    setComuna(''); // Reset comuna when region changes
                  }}
                >
                  <SelectTrigger id='company-region' className='w-full'>
                    <SelectValue placeholder='Seleccionar Región'>
                      {selectedRegion || 'Seleccionar Región'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chileanRegions.regiones.map((region) => (
                      <SelectItem key={region.region} value={region.region}>
                        {region.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ciudad && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.ciudad}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor='company-comuna'>
                  Comuna <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={comuna}
                  onValueChange={setComuna}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger id='company-comuna' className='w-full'>
                    <SelectValue placeholder='Seleccionar Comuna'>
                      {comuna || 'Seleccionar Comuna'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedRegion &&
                      chileanRegions.regiones
                        .find((r) => r.region === selectedRegion)
                        ?.comunas.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                {errors.comuna && (
                  <p className='text-xs text-destructive mt-1'>
                    {errors.comuna}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='company-giro'>
                  Giro <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  id='company-giro'
                  value={giro}
                  onChange={(e) => setGiro(e.target.value)}
                  className={inputBaseClass}
                  placeholder='Ej: Venta al por mayor de productos electrónicos'
                />
                {errors.giro && (
                  <p className='text-xs text-destructive mt-1'>{errors.giro}</p>
                )}
              </div>
              <div>
                <Label htmlFor='billing-phone'>Teléfono</Label>
                <div className='flex space-x-2 items-center'>
                  <Select
                    value={selectedCountry ? selectedCountry.cca2 : ''}
                    onValueChange={(value) => {
                      const country = countries.find((c: any) => c.cca2 === value);
                      setSelectedCountry(country);
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
                    type='tel'
                    id='billing-phone'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputBaseClass}
                    placeholder='Número de teléfono'
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='company-zip'>Código postal</Label>
                <Input
                  type='text'
                  id='company-zip'
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-end items-center gap-3 pt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='w-full sm:w-auto order-2 sm:order-1'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            className='w-full sm:w-auto order-1 sm:order-2'
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Guardando...'
              : companyData
                ? 'Actualizar'
                : 'Guardar'}
          </Button>
        </CardFooter>
      </form>

      {companyData && (
        <Dialog
          open={showContactPeopleModal}
          onOpenChange={setShowContactPeopleModal}
        >
          <DialogContent className='sm:max-w-[800px]'>
            <DialogHeader>
              <DialogTitle>Gestionar Personas de Contacto</DialogTitle>
              <DialogDescription>
                Aquí puedes añadir, editar o eliminar personas de contacto para
                esta empresa.
              </DialogDescription>
            </DialogHeader>
            <ContactPeopleManagement
              companyId={companyData.id}
              onClose={() => setShowContactPeopleModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default CompanyForm;
