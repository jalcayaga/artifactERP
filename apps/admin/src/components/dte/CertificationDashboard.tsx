'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@artifact/ui';
import {
    CheckCircleIcon,
    PlayIcon,
    ArrowDownTrayIcon,
    InformationCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

const TEST_CASES = [
    { id: 1, type: 33, name: 'Factura Electrónica (Simple)', description: 'Monto total sin decimales, 1 item.' },
    { id: 2, type: 33, name: 'Factura Electrónica (Exenta)', description: 'Incluye items no gravados con IVA.' },
    { id: 3, type: 33, name: 'Factura Electrónica (Descuento)', description: 'Aplica un descuento global al total.' },
    { id: 4, type: 61, name: 'Nota de Crédito', description: 'Referencia a Factura Case #1 (Anulación).' },
    { id: 5, type: 56, name: 'Nota de Débito', description: 'Referencia a Factura Case #1 (Ajuste).' },
    { id: 6, type: 34, name: 'Factura Exenta', description: 'Documento 100% exento de IVA.' },
    { id: 7, type: 39, name: 'Boleta Electrónica', description: 'Consumo final (Simple).' },
    { id: 8, type: 41, name: 'Boleta Exenta', description: 'Consumo final exento.' },
];

export function CertificationDashboard() {
    const [loading, setLoading] = useState<number | null>(null);
    const [results, setResults] = useState<Record<number, any>>({});

    const runCase = async (caseId: number) => {
        setLoading(caseId);
        try {
            const response = await fetch(`/api/dte/certification/case/${caseId}`, { method: 'POST' });
            const data = await response.json();
            setResults(prev => ({ ...prev, [caseId]: data }));
        } catch (error) {
            console.error("Error generating certification case:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-background/60 backdrop-blur-xl border-emerald-500/20 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircleIcon className="h-24 w-24 text-emerald-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Certificación SII: Set de Pruebas
                    </CardTitle>
                    <p className="text-slate-400 text-sm max-w-2xl mt-1">
                        Genera los documentos obligatorios requeridos para el proceso de certificación automática.
                        Asegúrate de haber cargado un Certificado Digital válido y un CAF de prueba.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TEST_CASES.map((testCase) => (
                            <Card key={testCase.id} className="bg-black/20 border-white/5 hover:border-emerald-500/30 transition-all group">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/30 text-emerald-400">
                                            DTE {testCase.type}
                                        </Badge>
                                        {results[testCase.id] ? (
                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none flex gap-1 items-center">
                                                <CheckCircleIcon className="h-3 w-3" /> LISTO
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="opacity-50">PEDIENTE</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-sm font-semibold mt-2">CASO #{testCase.id}: {testCase.name}</CardTitle>
                                    <p className="text-[11px] leading-tight text-slate-400 mt-1">
                                        {testCase.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold h-8 text-[11px]"
                                            onClick={() => runCase(testCase.id)}
                                            disabled={loading === testCase.id}
                                        >
                                            {loading === testCase.id ? (
                                                <span className="flex items-center gap-1"><PlayIcon className="h-4 w-4 animate-pulse" /> GENERANDO...</span>
                                            ) : (
                                                <span className="flex items-center gap-1"><PlayIcon className="h-4 w-4" /> GENERAR</span>
                                            )}
                                        </Button>
                                        {results[testCase.id] && (
                                            <Button size="icon" variant="outline" className="h-8 w-8 shrink-0 border-white/10">
                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {results[testCase.id] && (
                                        <div className="mt-2 text-[10px] text-muted-foreground truncate opacity-50">
                                            Folio: {results[testCase.id].dteFolio} | Track: {results[testCase.id].dteTrackId}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
