import React, { useState, useEffect, FormEvent } from 'react';
import { Company, CreateCompanyDto, UpdateCompanyDto, ContactPerson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BriefcaseIcon, UsersIcon as UserIcon } from '@/components/Icons';
import { CompanyService } from '@/lib/services/companyService';
import { ContactPersonService } from '@/lib/services/contactPersonService';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';
import { validateRut } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ContactPeopleManagement from './ContactPeopleManagement';

interface CompanyFormProps {
  companyData: Company | null;
  onSave: (company: Company) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ companyData, onSave, onCancel }) => {
  const { token, currentUser } = useAuth();
  
  // Company fields
  const [fantasyName, setFantasyName] = useState('');
  const [isClient, setIsClient] = useState(true);
  const [isSupplier, setIsSupplier] = useState(false);

  

  // Billing fields
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [address, setAddress] = useState('');
  const [comuna, setComuna] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [giro, setGiro] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [zip, setZip] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactPeopleModal, setShowContactPeopleModal] = useState(false);

  useEffect(() => {
    if (companyData) {
      setFantasyName(companyData.fantasyName || '');
      setRazonSocial(companyData.name);
      setRut(companyData.rut || '');
      setGiro(companyData.giro || '');
      setAddress(companyData.address || '');
      setComuna(companyData.city || '');
      setCiudad(companyData.state || '');
      setZip(companyData.zip || '');
      setBillingPhone(companyData.phone || '');
      setIsClient(companyData.isClient);
      setIsSupplier(companyData.isSupplier);

      
    } else {
      // Reset form for new company
      setFantasyName('');
      setRazonSocial('');
      setRut('');
      setGiro('');
      setAddress('');
      setComuna('');
      setCiudad('');
      setZip('');
      setBillingPhone('');
      setIsClient(true);
      setIsSupplier(false);
      
    }
    setErrors({});
  }, [companyData, token]);

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
    if (!fantasyName.trim()) newErrors.fantasyName = 'El nombre de fantasía es requerido.';
    
    if (!razonSocial.trim()) newErrors.razonSocial = 'La razón social es requerida.';
    
    if (!rut.trim()) {
      newErrors.rut = 'El RUT es requerido.';
    } else if (!validateRut(rut)) {
      newErrors.rut = 'El formato del RUT no es válido.';
    }

    if (!giro.trim()) newErrors.giro = 'El giro es requerido.';
    if (!address.trim()) newErrors.address = 'La dirección es requerida.';
    if (!comuna.trim()) newErrors.comuna = 'La comuna es requerido.';
    if (!ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida.';

    
    if (!isClient && !isSupplier) newErrors.roles = 'Debe seleccionar al menos un rol (Cliente o Proveedor).';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, corrija los errores en el formulario.");
      return;
    }

    if (!currentUser?.id) {
      toast.error("No se pudo determinar el usuario actual.");
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
        state: ciudad.trim() || undefined,
        zip: zip.trim() || undefined,
        phone: billingPhone.trim() || undefined,
        isClient,
        isSupplier,
      };

      let savedCompany: Company;
      if (companyData) {
        savedCompany = await CompanyService.updateCompany(companyData.id, companyDetails as UpdateCompanyDto);
      } else {
        // @ts-ignore
        savedCompany = await CompanyService.createCompany({ ...companyDetails, userId: currentUser.id });
      }

      

      toast.success(`Empresa ${savedCompany.name} guardada exitosamente.`);
      onSave(savedCompany);
    } catch (error: any) {
      console.error("Error saving company:", error);
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message || "Ya existe una empresa con el mismo RUT o email.");
      } else {
        toast.error(error.message || "Error al guardar la empresa.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";

  return (
    <Card className="max-w-4xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BriefcaseIcon className="w-6 h-6 mr-2 text-primary" />
          {companyData ? `Editar: ${companyData.fantasyName || companyData.name}` : 'Crear Cliente o Proveedor'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {/* Section: General Info */}
          <div className="p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fantasy-name">Nombre de fantasía <span className="text-red-500">*</span></Label>
                <Input type="text" id="fantasy-name" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} className={inputBaseClass} />
                {errors.fantasyName && <p className="text-xs text-destructive mt-1">{errors.fantasyName}</p>}
                <p className="text-xs text-muted-foreground mt-1">Si no existe el nombre de fantasía puede usar algún nombre representativo.</p>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex items-center">
                  <Checkbox id="is-client" checked={isClient} onCheckedChange={(checked) => setIsClient(!!checked)} />
                  <Label htmlFor="is-client" className="ml-2 text-sm font-medium text-foreground">Es Cliente</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="is-supplier" checked={isSupplier} onCheckedChange={(checked) => setIsSupplier(!!checked)} />
                  <Label htmlFor="is-supplier" className="ml-2 text-sm font-medium text-foreground">Es Proveedor</Label>
                </div>
                {errors.roles && <p className="text-xs text-destructive">{errors.roles}</p>}
              </div>
            </div>
            {companyData && (
              <div className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowContactPeopleModal(true)}>
                  <UserIcon className="w-4 h-4 mr-2" /> Gestionar Contactos
                </Button>
              </div>
            )}
          </div>

          

          {/* Section: Billing Data */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Datos de facturación</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si existen más datos de facturación, puede ingresarlos luego de crear al cliente/proveedor, en la pantalla Modificar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>País</Label>
                <Input type="text" value="CHILE" disabled className={`${inputBaseClass} bg-muted/50`} />
              </div>
              <div>
                <Label htmlFor="company-rut">RUT Cliente/Proveedor <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-rut" value={rut} onChange={handleRutChange} className={inputBaseClass} placeholder="Ej: 12.345.678-9"/>
                {errors.rut && <p className="text-xs text-destructive mt-1">{errors.rut}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company-name">Nombre o Razón Social <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-name" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} className={inputBaseClass} />
                {errors.razonSocial && <p className="text-xs text-destructive mt-1">{errors.razonSocial}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company-address">Dirección <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputBaseClass} />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
              </div>
              <div>
                <Label htmlFor="company-comuna">Comuna <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-comuna" value={comuna} onChange={(e) => setComuna(e.target.value)} className={inputBaseClass} />
                {errors.comuna && <p className="text-xs text-destructive mt-1">{errors.comuna}</p>}
              </div>
              <div>
                <Label htmlFor="company-ciudad">Ciudad <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className={inputBaseClass} />
                {errors.ciudad && <p className="text-xs text-destructive mt-1">{errors.ciudad}</p>}
              </div>
              <div>
                <Label htmlFor="company-giro">Giro <span className="text-red-500">*</span></Label>
                <Input type="text" id="company-giro" value={giro} onChange={(e) => setGiro(e.target.value)} className={inputBaseClass} />
                {errors.giro && <p className="text-xs text-destructive mt-1">{errors.giro}</p>}
              </div>
              <div>
                <Label htmlFor="billing-phone">Teléfono</Label>
                <Input type="tel" id="billing-phone" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} className={inputBaseClass} />
              </div>
              <div>
                <Label htmlFor="company-zip">Código postal</Label>
                <Input type="text" id="company-zip" value={zip} onChange={(e) => setZip(e.target.value)} className={inputBaseClass} />
              </div>
            </div>
            {companyData && (
              <div className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowContactPeopleModal(true)}>
                  <UserIcon className="w-4 h-4 mr-2" /> Gestionar Contactos
                </Button>
              </div>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">Cancelar</Button>
          <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (companyData ? 'Actualizar' : 'Guardar')}
          </Button>
        </CardFooter>
      </form>

      {companyData && (
        <Dialog open={showContactPeopleModal} onOpenChange={setShowContactPeopleModal}>
          <DialogContent className="sm:max-w-[800px]">
            <ContactPeopleManagement companyId={companyData.id} onClose={() => setShowContactPeopleModal(false)} />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default CompanyForm;