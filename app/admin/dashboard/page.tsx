import React from "react";
import { supabase } from "@/lib/supabase";
import { Posada } from "@/types/posada";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { Activity, Users, MousePointer2, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch data
  const { data: logs, error: logsError } = await supabase
    .from("contact_logs")
    .select("*, posadas(name)");
    
  const { data: posadas, error: posadasError } = await supabase
    .from("posadas")
    .select("*");

  if (logsError || posadasError) {
    return <div className="pt-32 px-6">Error cargando estadísticas.</div>;
  }

  // Processing KPIs
  const totalLeads = logs?.length || 0;
  
  const posadaCounts: Record<string, number> = {};
  logs?.forEach(log => {
    const name = log.posadas?.name || "Desconocida";
    posadaCounts[name] = (posadaCounts[name] || 0) + 1;
  });

  const mostVisited = Object.entries(posadaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  const mobileCount = logs?.filter(l => l.device_type?.toLowerCase() === "mobile" || l.device_type?.toLowerCase() === "phone").length || 0;
  const mobilePercentage = totalLeads > 0 ? Math.round((mobileCount / totalLeads) * 100) : 0;

  // Data for Charts
  const barChartData = Object.entries(posadaCounts).map(([name, count]) => ({
    name,
    leads: count,
  }));

  const osCounts: Record<string, number> = {};
  logs?.forEach(log => {
    const os = log.os || "Otro";
    osCounts[os] = (osCounts[os] || 0) + 1;
  });

  const donutData = Object.entries(osCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const recentActivity = logs?.slice(0, 10).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="pt-24 pb-20 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-2">Panel de Estadísticas</h1>
          <p className="text-primary/80 mb-2">Monitorea el rendimiento de tus posadas y el comportamiento de los clientes.</p>
        </header>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPICard 
            title="Total de Leads" 
            value={totalLeads.toString()} 
            icon={<MousePointer2 className="text-secondary" />} 
            trend="+12%" 
          />
          <KPICard 
            title="Posada Popular" 
            value={mostVisited} 
            icon={<Activity className="text-secondary" />} 
          />
          <KPICard 
            title="Tráfico Móvil" 
            value={`${mobilePercentage}%`} 
            icon={<Users className="text-secondary" />} 
            trend="Alta"
          />
          <KPICard 
            title="Tasa de Conversión" 
            value="4.2%" 
            icon={<TrendingUp className="text-secondary" />} 
            trend="+0.5%"
          />
        </div>

        {/* Charts Section */}
        <DashboardCharts barData={barChartData} donutData={donutData} />

        {/* Recent Activity Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/5 p-8 mt-10">
          <h3 className="text-xl font-playfair font-bold text-primary mb-6">Actividad Reciente</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-primary/70 text-xs uppercase tracking-wider border-b border-primary/10">
                  <th className="pb-4 font-bold">Fecha / Hora</th>
                  <th className="pb-4 font-bold">Posada</th>
                  <th className="pb-4 font-bold">Canal</th>
                  <th className="pb-4 font-bold">Dispositivo</th>
                  <th className="pb-4 font-bold">S.O.</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentActivity?.map((log) => (
                  <tr key={log.id} className="border-b border-primary/5 last:border-0 hover:bg-background/50 transition-colors">
                    <td className="py-4 text-primary/80">
                      {new Date(log.created_at).toLocaleString('es-VE')}
                    </td>
                    <td className="py-4 font-bold text-primary">{log.posadas?.name}</td>
                    <td className="py-4">
                      <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        {log.tipo_contacto}
                      </span>
                    </td>
                    <td className="py-4 text-primary/80 capitalize">{log.device_type}</td>
                    <td className="py-4 text-primary/80">{log.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-accent/10 rounded-2xl">{icon}</div>
        {trend && (
          <span className="text-[10px] font-bold text-secondary bg-secondary/5 px-2 py-1 rounded-full uppercase tracking-tighter">
            {trend}
          </span>
        )}
      </div>
      <p className="text-primary/70 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-primary truncate" title={value}>{value}</h4>
    </div>
  );
}
