import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input } from "@artifact/ui";
import { User } from "@/lib/types";

interface UserFormProps {
    user?: User | null;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function UserForm({ user, onSave, onCancel, isLoading }: UserFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: user || {
            email: '',
            firstName: '',
            lastName: '',
        }
    });

    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="bg-transparent border-none p-0 max-w-md mx-auto">
            <div className="p-6 bg-[#1a2537] rounded-3xl border border-white/10 w-full relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white mb-6 font-space-grotesk">
                        {user ? "Editar Usuario" : "Nuevo Usuario"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSave)} className="space-y-4 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Nombre</label>
                            <Input
                                {...register("firstName", { required: "El nombre es requerido" })}
                                placeholder="Ej: Juan"
                                className="bg-white/5 border-white/10 text-white rounded-xl"
                            />
                            {errors.firstName && <span className="text-red-400 text-xs">{errors.firstName.message as string}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Apellido</label>
                            <Input
                                {...register("lastName", { required: "El apellido es requerido" })}
                                placeholder="Ej: Pérez"
                                className="bg-white/5 border-white/10 text-white rounded-xl"
                            />
                            {errors.lastName && <span className="text-red-400 text-xs">{errors.lastName.message as string}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Email Corporativo</label>
                        <Input
                            {...register("email", {
                                required: "El email es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            })}
                            type="email"
                            placeholder="juan.perez@empresa.com"
                            className="bg-white/5 border-white/10 text-white rounded-xl"
                            disabled={!!user} // Email often immutable
                        />
                        {errors.email && <span className="text-red-400 text-xs">{errors.email.message as string}</span>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="flex-1 text-slate-400 hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? "Guardando..." : "Guardar Usuario"}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
}
