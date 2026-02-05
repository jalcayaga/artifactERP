'use client';

import React, { useState, useEffect, useCallback } from "react";
import { defaultTheme, Theme } from "@/lib/theme";
import { TenantService } from "@/lib/services/tenant.service";
import { toast } from "sonner";

interface ThemeEditorProps {
  onSave?: (theme: Theme) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ onSave }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await TenantService.getConfig();
        if (config.branding) {
          const b = config.branding;
          const lightTheme = (b.lightTheme as any) || {};

          setTheme({
            brandColor: b.primaryColor || defaultTheme.brandColor,
            textColor: lightTheme.textColor || defaultTheme.textColor,
            logoUrl: b.logoUrl || defaultTheme.logoUrl,
            radius: lightTheme.radius || defaultTheme.radius,
            font: lightTheme.font || defaultTheme.font,
          });
        }
      } catch (error) {
        console.error("Error fetching branding:", error);
        toast.error("Error al cargar la configuración de marca");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Map Theme back to TenantBranding fields
      const brandingPayload = {
        primaryColor: theme.brandColor,
        logoUrl: theme.logoUrl,
        lightTheme: {
          textColor: theme.textColor,
          radius: theme.radius,
          font: theme.font,
        }
      };

      await TenantService.updateBranding(brandingPayload);
      onSave?.(theme);
      toast.success("Configuración de marca guardada correctamente");
    } catch (error) {
      console.error("Error saving branding:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando configuración...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card-premium p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Personalizar Apariencia</h2>
        <div
          className="w-10 h-10 rounded shadow-inner"
          style={{ backgroundColor: theme.brandColor }}
          title="Vista previa del color"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700">Color Principal</label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              id="brandColor"
              name="brandColor"
              value={theme.brandColor}
              onChange={handleChange}
              className="block w-12 h-10 rounded-md shadow-sm p-1 cursor-pointer"
            />
            <input
              type="text"
              name="brandColor"
              value={theme.brandColor}
              onChange={handleChange}
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Color de Texto</label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              id="textColor"
              name="textColor"
              value={theme.textColor}
              onChange={handleChange}
              className="block w-12 h-10 rounded-md shadow-sm p-1 cursor-pointer"
            />
            <input
              type="text"
              name="textColor"
              value={theme.textColor}
              onChange={handleChange}
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL del Logo</label>
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            value={theme.logoUrl}
            onChange={handleChange}
            className="input-primary mt-1 block w-full"
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700">Radio de Borde</label>
            <select
              id="radius"
              name="radius"
              value={theme.radius}
              onChange={(e: any) => handleChange(e)}
              className="input-primary mt-1 block w-full"
            >
              <option value="0">Sin redondeo</option>
              <option value="0.25rem">Pequeño (4px)</option>
              <option value="0.5rem">Medio (8px)</option>
              <option value="0.75rem">Grande (12px)</option>
              <option value="1rem">Muy grande (16px)</option>
              <option value="9999px">Cápsula</option>
            </select>
          </div>

          <div>
            <label htmlFor="font" className="block text-sm font-medium text-gray-700">Fuente</label>
            <select
              id="font"
              name="font"
              value={theme.font}
              onChange={(e: any) => handleChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
            >
              <option value="sans-serif">Sans Serif (Moderna)</option>
              <option value="serif">Serif (Clásica)</option>
              <option value="mono">Monospace (Técnica)</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[rgba(var(--border-color),0.2)] flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};

export default ThemeEditor;
