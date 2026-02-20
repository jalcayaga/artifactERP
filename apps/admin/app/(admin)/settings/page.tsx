import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@artifact/ui';
import { Label } from '@artifact/ui';
import { Input } from '@artifact/ui';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <Card className="border-white/[0.05] bg-[#1e293b]/40 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-white">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label className="text-white">Nombre de la Organización</Label>
                        <Input defaultValue="Artifact ERP Demo" className="bg-slate-900/50 border-white/[0.05] text-white" disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-white">Dominio Principal</Label>
                        <Input defaultValue="demo.artifact.app" className="bg-slate-900/50 border-white/[0.05] text-white" disabled />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
