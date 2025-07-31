// Importaciones de React y componentes/iconos necesarios.
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { UsersIcon, ShoppingCartIcon, ArchiveBoxIcon, CreditCardIcon } from '@/components/Icons';
import SalesChart from '@/components/SalesChart'; // Importar el nuevo componente de gráfico
import { DashboardService } from '@/lib/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats, RecentActivity } from '@/lib/types';
import { formatCurrencyChilean } from '@/lib/utils';

// Interfaz para una tarea
interface Task {
  id: number;
  text: string;
  due: string;
  completed: boolean;
}

// Props para el componente StatCard (tarjeta de estadística).
interface StatCardProps {
  title: string; // Título de la estadística (ej. "Clientes Activos").
  value: string; // Valor de la estadística (ej. "1,280").
  icon: React.FC<{className?: string}>; // Componente del icono a mostrar.
}

// Componente para mostrar una tarjeta de estadística individual.
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5"> {/* Using default p-5 from CardContent */}
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-primary/10 dark:bg-primary/20 mr-4`}>
            <Icon className={`w-6 h-6 text-primary`} />
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

const LOCAL_STORAGE_KEY_TASKS = 'wolfflow_dashboard_tasks';

// Datos iniciales de ejemplo para las tareas.
const initialTasksData: Task[] = [
  { id: 1, text: "Revisar propuesta Cliente Alfa", due: "Mañana", completed: false },
  { id: 2, text: "Contactar Proveedor Beta", due: "En 3 días", completed: false },
  { id: 3, text: "Generar reporte de ventas Q3", due: "Próxima semana", completed: false },
  { id: 4, text: "Actualizar inventario", due: "Hoy", completed: true },
];

// Componente principal para la vista del Dashboard.
const DashboardView: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Carga inicial de tareas desde localStorage o usa datos iniciales.
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks) as Task[];
        // Asegurarse de que todas las tareas tengan la propiedad 'completed'
        return parsedTasks.map(task => ({ ...task, completed: task.completed || false }));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
    return initialTasksData;
  });

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setStatsError('No autorizado. Por favor, inicie sesión como administrador.');
        setLoadingStats(false);
        return;
      }
      try {
        const stats = await DashboardService.getStats(token);
        setDashboardStats(stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setStatsError('Error al cargar las estadísticas del dashboard.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [token]);

  // Efecto para guardar las tareas en localStorage cada vez que cambian.
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }, [tasks]);

  // Función para marcar/desmarcar una tarea como completada.
  const handleToggleTask = useCallback((taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  // Datos de ejemplo para la actividad reciente (esto se conectará al backend más adelante).
  const recentActivities = dashboardStats?.recentActivities.map(activity => ({
    id: activity.id,
    user: `${activity.user.firstName} ${activity.user.lastName}`,
    action: `creó un pedido con estado ${activity.status}`,
    time: new Date(activity.createdAt).toLocaleDateString(), // Or format more precisely
    avatar: `https://placehold.co/40x40/EFEFEF/31343C?text=${activity.user.firstName.charAt(0)}`,
  })) || [];
  
  return (
    <div className="space-y-6 lg:space-y-8">
      <h1 className="text-3xl font-semibold text-foreground">Dashboard General</h1>
      
      {/* Sección de Tarjetas de Estadísticas */}
      {loadingStats ? (
        <p>Cargando estadísticas...</p>
      ) : statsError ? (
        <p className="text-destructive">{statsError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Clientes Activos" value={dashboardStats?.totalUsers.toString() || 'N/A'} icon={UsersIcon} />
          <StatCard title="Ventas del Mes" value={formatCurrencyChilean(dashboardStats?.totalSalesAmount || 0)} icon={ShoppingCartIcon} />
          <StatCard title="Productos en Stock" value={dashboardStats?.totalProducts.toString() || 'N/A'} icon={ArchiveBoxIcon} />
          <StatCard title="Facturas Pendientes" value={dashboardStats?.pendingInvoices.toString() || 'N/A'} icon={CreditCardIcon} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Sección de Actividad Reciente */}
        {/* TODO: Conectar esta lista a datos reales del backend. */}
        <Card className="lg:col-span-2">
          <CardHeader> {/* Uses default p-5 */}
            <CardTitle className="text-xl text-primary">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent> {/* Uses default p-5 pt-0 */}
            <ul className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <img className="w-10 h-10 rounded-full" src={activity.avatar} alt={activity.user} />
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action}.
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No hay actividad reciente.</p>
              )}
            </ul>
            <div className="mt-6 text-right"> 
                <button className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70">
                    Ver toda la actividad
                </button>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Tareas Pendientes (Ahora interactiva y persistente) */}
        <Card>
          <CardHeader> {/* Uses default p-5 */}
            <CardTitle className="text-lg">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent> {/* Uses default p-5 pt-0. If less top padding is desired for content right after header, add pt-2 or similar */}
            {tasks.length > 0 ? (
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between">
                    <div className={`flex-1 ${task.completed ? 'opacity-60' : ''}`}>
                      <label 
                        htmlFor={`task-${task.id}`} 
                        className={`text-sm font-medium text-foreground cursor-pointer ${task.completed ? 'line-through' : ''}`}
                      >
                        {task.text}
                      </label>
                      <p className={`text-xs text-muted-foreground ${task.completed ? 'line-through' : ''}`}>Vence: {task.due}</p>
                    </div>
                    <input 
                      id={`task-${task.id}`}
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary ml-3 flex-shrink-0" 
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-4">No hay tareas pendientes.</p>
            )}
            <div className="mt-4 text-right">
                <button className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70">
                    Ver todas las tareas
                </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Resumen de Ventas */}
      <Card>
        <CardHeader> {/* Uses default p-5 */}
          <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
        </CardHeader>
        <CardContent className="p-5"> {/* Use default p-5 for chart content area */}
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;