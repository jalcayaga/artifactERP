// Importaciones de React y componentes/iconos necesarios.
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UsersIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  CreditCardIcon,
  ChartPieIcon,
} from "@/icons";

// Props para el componente StatCard (tarjeta de estadística).
interface StatCardProps {
  title: string; // Título de la estadística (ej. "Clientes Activos").
  value: string; // Valor de la estadística (ej. "1,280").
  icon: React.FC<{ className?: string }>; // Componente del icono a mostrar.
  // bgColorClass and textColorClass are now derived from primary theme colors
}

// Componente para mostrar una tarjeta de estadística individual.
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {" "}
        {/* shadcn cards suelen tener padding en CardContent, p-4 es un buen default */}
        <div className="flex items-center">
          <div
            className={`p-3 rounded-lg bg-primary/10 dark:bg-primary/20 mr-4`}
          >
            {" "}
            {/* Updated icon background */}
            <Icon className={`w-6 h-6 text-primary`} />{" "}
            {/* Updated icon color */}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal para la vista del Dashboard.
const DashboardView: React.FC = () => {
  // Datos de ejemplo para la actividad reciente.
  const recentActivities = [
    {
      id: 1,
      user: "Ana Pérez",
      action: "creó una nueva cotización",
      time: "Hace 25 minutos",
      avatar: `https://picsum.photos/seed/ana/40/40`,
    },
    {
      id: 2,
      user: "Carlos Ruiz",
      action: 'actualizó el cliente "Tech Solutions"',
      time: "Hace 1 hora",
      avatar: `https://picsum.photos/seed/carlos/40/40`,
    },
    {
      id: 3,
      user: "Laura Gómez",
      action: "registró una nueva compra",
      time: "Hace 3 horas",
      avatar: `https://picsum.photos/seed/laura/40/40`,
    },
    {
      id: 4,
      user: "Pedro Marín",
      action: 'agregó 50 unidades de "Producto X"',
      time: "Ayer",
      avatar: `https://picsum.photos/seed/pedro/40/40`,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-foreground">
        Dashboard General
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* StatCard instances will now use the new primary-based styling */}
        <StatCard
          title="Clientes Activos"
          value="1,280"
          icon={UsersIcon}
        />
        <StatCard
          title="Ventas del Mes"
          value="$45,670"
          icon={ShoppingCartIcon}
        />
        <StatCard
          title="Productos en Stock"
          value="8,923"
          icon={ArchiveBoxIcon}
        />
        <StatCard
          title="Facturas Pendientes"
          value="12"
          icon={CreditCardIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start space-x-3"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={activity.avatar}
                    alt={activity.user}
                  />
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70">
                Ver todo
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-3">
              {[
                {
                  id: 1,
                  text: "Revisar propuesta Cliente Alfa",
                  due: "Mañana",
                },
                { id: 2, text: "Contactar Proveedor Beta", due: "En 3 días" },
                {
                  id: 3,
                  text: "Generar reporte de ventas Q3",
                  due: "Próxima semana",
                },
                { id: 4, text: "Actualizar inventario", due: "Hoy" },
              ].map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {task.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vence: {task.due}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                  />
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70">
                Ver todas las tareas
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-12 px-4">
            <ChartPieIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">
              Gráfico de Ventas
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Visualización de datos de ventas y tendencias.
            </p>
            <p className="mt-1 text-sm text-muted-foreground italic">
              (Funcionalidad de gráfico próximamente)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
