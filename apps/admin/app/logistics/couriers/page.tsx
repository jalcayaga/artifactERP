"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Card, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, IconButton, Select, Option } from "@material-tailwind/react";
import { Plus, Pencil, Trash2, Search, Truck } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function CouriersPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCourier, setEditingCourier] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    // Fetch Couriers
    const { data: couriers, isLoading } = useQuery({
        queryKey: ['couriers'],
        queryFn: async () => {
            const res = await apiClient.get<any>('/couriers');
            return res.data;
        }
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (data: any) => apiClient.post('/couriers', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['couriers'] });
            setIsOpen(false);
            toast.success("Courier creado exitosamente");
        },
        onError: () => toast.error("Error al crear courier")
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (data: any) => apiClient.patch(`/couriers/${editingCourier.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['couriers'] });
            setIsOpen(false);
            setEditingCourier(null);
            toast.success("Courier actualizado exitosamente");
        },
        onError: () => toast.error("Error al actualizar courier")
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => apiClient.delete(`/couriers/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['couriers'] });
            toast.success("Courier eliminado");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            contactName: formData.get('contactName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            websiteUrl: formData.get('websiteUrl'),
            integrationType: formData.get('integrationType'),
            apiKey: formData.get('apiKey'),
            isActive: true
        };

        if (editingCourier) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (courier: any) => {
        setEditingCourier(courier);
        setIsOpen(true);
    };

    const filteredCouriers = couriers?.filter((c: any) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Truck className="w-8 h-8 text-blue-500" />
                        Gestión de Couriers
                    </h1>
                    <p className="text-gray-400">Administra las empresas de transporte y sus integraciones.</p>
                </div>
                <Button onClick={() => { setEditingCourier(null); setIsOpen(true); }} className="bg-blue-600 flex items-center gap-2" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                    <Plus size={18} /> Nuevo Courier
                </Button>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full bg-slate-800 border-none rounded-lg pl-10 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-slate-900 border border-white/10 overflow-hidden" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-white font-semibold">Nombre</th>
                                <th className="p-4 text-white font-semibold">Contacto</th>
                                <th className="p-4 text-white font-semibold">Integración</th>
                                <th className="p-4 text-white font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">Cargando...</td></tr>
                            ) : filteredCouriers?.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No hay couriers registrados</td></tr>
                            ) : (
                                filteredCouriers?.map((courier: any) => (
                                    <tr key={courier.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{courier.name}</div>
                                            <div className="text-sm text-gray-500">{courier.websiteUrl}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">{courier.contactName || '-'}</div>
                                            <div className="text-sm text-gray-500">{courier.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${courier.integrationType === 'MANUAL'
                                                ? 'bg-gray-800 text-gray-300'
                                                : 'bg-green-900/30 text-green-400 border border-green-500/30'
                                                }`}>
                                                {courier.integrationType || 'MANUAL'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <IconButton variant="text" color="blue" onClick={() => handleEdit(courier)} placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                                <Pencil size={18} />
                                            </IconButton>
                                            <IconButton variant="text" color="red" onClick={() => {
                                                if (confirm('¿Eliminar este courier?')) deleteMutation.mutate(courier.id);
                                            }} placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} open={isOpen} handler={() => setIsOpen(false)} className="bg-slate-900 border border-white/10" placeholder="">
                <DialogHeader onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-white" placeholder="">
                    {editingCourier ? 'Editar Courier' : 'Nuevo Courier'}
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="grid gap-4" placeholder="">
                        <Input label="Nombre de la Empresa" name="name" defaultValue={editingCourier?.name} required className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Nombre de Contacto" name="contactName" defaultValue={editingCourier?.contactName} className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                            <Input label="Teléfono" name="phone" defaultValue={editingCourier?.phone} className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                        </div>
                        <Input label="Email" name="email" type="email" defaultValue={editingCourier?.email} className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                        <Input label="Sitio Web" name="websiteUrl" defaultValue={editingCourier?.websiteUrl} className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Tipo de Integración</label>
                            <select
                                name="integrationType"
                                defaultValue={editingCourier?.integrationType || "MANUAL"}
                                className="w-full bg-slate-900 border border-blue-gray-200 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="MANUAL">Manual (Sin integración)</option>
                                <option value="STARKEN_API">Starken API</option>
                                <option value="CHILEXPRESS_API">Chilexpress API</option>
                            </select>
                        </div>

                        <Input label="API Key (Opcional)" name="apiKey" type="password" defaultValue={editingCourier?.apiKey} className="text-white" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
                    </DialogBody>
                    <DialogFooter onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="gap-2" placeholder="">
                        <Button variant="text" color="white" onClick={() => setIsOpen(false)} placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="blue" placeholder="" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}>
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
}
