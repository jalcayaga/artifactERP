import React, { useState, useEffect, FormEvent } from 'react';
import { Client } from '@/lib/types'; 
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; 
import { UsersIcon } from '@/components/Icons';

interface ClientFormProps {
  clientData: Client | null;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientData, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'Empresa' | 'Persona'>('Empresa');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clientData) {
      setName(clientData.name);
      setContactName(clientData.contactName || '');
      setEmail(clientData.email || '');
      setPhone(clientData.phone || '');
      setType(clientData.type);
    } else {
      setName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setType('Empresa');
    }
    setErrors({});
  }, [clientData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!type) newErrors.type = 'El tipo de cliente es requerido.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      id: clientData?.id || '',
      name: name.trim(),
      contactName: contactName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      type,
    });
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm transition-colors duration-150 bg-background border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground";
  const selectBaseClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-150 bg-background border-border focus:ring-2 focus:ring-ring focus:border-ring text-foreground";


  return (
    <Card className="max-w-2xl mx-auto border">
      <CardHeader>
        <CardTitle className="text-xl">{clientData ? `Editar Cliente: ${clientData.name}` : 'Nuevo Cliente'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-foreground">
              Nombre / Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputBaseClass}
              aria-required="true"
              aria-describedby="name-error"
            />
            {errors.name && <p id="name-error" className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="client-contact-name" className="block text-sm font-medium text-foreground">
              Nombre de Contacto
            </label>
            <input
              type="text"
              id="client-contact-name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          <div>
            <label htmlFor="client-email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              id="client-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseClass}
              aria-describedby="email-error"
            />
            {errors.email && <p id="email-error" className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="client-phone" className="block text-sm font-medium text-foreground">
              Teléfono
            </label>
            <input
              type="tel"
              id="client-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          <div>
            <label htmlFor="client-type" className="block text-sm font-medium text-foreground">
              Tipo de Cliente <span className="text-red-500">*</span>
            </label>
            <select
              id="client-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'Empresa' | 'Persona')}
              className={selectBaseClass}
              aria-required="true"
              aria-describedby="type-error"
            >
              <option value="Empresa">Empresa</option>
              <option value="Persona">Persona</option>
            </select>
            {errors.type && <p id="type-error" className="mt-1 text-xs text-destructive">{errors.type}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-background transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <UsersIcon className="w-5 h-5" />
            <span>{clientData ? 'Actualizar Cliente' : 'Guardar Cliente'}</span>
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientForm;