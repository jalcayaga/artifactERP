'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '@artifact/ui';
import Link from 'next/link';
import { ChevronLeftIcon } from '@artifact/ui';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle>Recuperar Contraseña</CardTitle>
                    <CardDescription className="text-white/60">
                        Esta funcionalidad estará disponible próximamente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/80">
                        Por favor contacta a soporte@artifact.cl para restablecer tu contraseña manualmente.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full gap-2">
                            <ChevronLeftIcon className="w-4 h-4" />
                            Volver al Login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
