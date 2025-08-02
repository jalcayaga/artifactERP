import React, { useState, useEffect, FormEvent } from 'react';
import { ContactPerson, CreateContactPersonDto, UpdateContactPersonDto } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UsersIcon } from '@/components/Icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ContactPersonService } from '@/lib/services/contactPersonService';

interface ContactPersonFormProps {
  companyId: string;
  contactPersonData: ContactPerson | null;
  onSave: (contactPerson: ContactPerson) => void;
  onCancel: () => void;
}

const ContactPersonForm: React.FC<ContactPersonFormProps> = ({ companyId, contactPersonData, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contactPersonData) {
      setFirstName(contactPersonData.firstName);
      setLastName(contactPersonData.lastName || '');
      setEmail(contactPersonData.email || '');
      setPhone(contactPersonData.phone || '');
      setRole(contactPersonData.role || '');
    } else {
      // Reset form for new contact person
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('');
    }
    setErrors({});
  }, [contactPersonData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor, corrija los errores en el formulario.");
      return;
    }

    setIsSubmitting(true);
    try {
      const contactPersonDetails: CreateContactPersonDto = {
        companyId,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        role: role.trim() || undefined,
      };

      let savedContactPerson: ContactPerson;
      if (contactPersonData) {
        savedContactPerson = await ContactPersonService.updateContactPerson(
          companyId,
          contactPersonData.id,
          contactPersonDetails as UpdateContactPersonDto
        );
      } else {
        savedContactPerson = await ContactPersonService.createContactPerson(
          companyId,
          contactPersonDetails
        );
      }

      toast.success(`Persona de contacto ${savedContactPerson.firstName} guardada exitosamente.`);
      onSave(savedContactPerson);
    } catch (error: any) {
      console.error("Error saving contact person:", error);
      toast.error(error.message || "Error al guardar la persona de contacto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";

  return (
    <Card className="max-w-2xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <UsersIcon className="w-6 h-6 mr-2 text-primary" />
          {contactPersonData ? `Editar: ${contactPersonData.firstName} ${contactPersonData.lastName || ''}` : ''}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="firstName">Nombre <span className="text-red-500">*</span></Label>
            <Input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputBaseClass} />
            {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputBaseClass} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClass} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBaseClass} />
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <Input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} className={inputBaseClass} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (contactPersonData ? 'Actualizar' : 'Guardar')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContactPersonForm;