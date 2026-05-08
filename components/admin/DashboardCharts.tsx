"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  leads?: number;
  value?: number;
}

interface DashboardChartsProps {
  barData: ChartData[];
  donutData: ChartData[];
}

const COLORS = ["#4A3728", "#D4A373", "#CCD5AE", "#E9EDC9", "#FEFAE0"];

export default function DashboardCharts({ barData, donutData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Bar Chart - Clicks per Posada */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-primary/5">
        <h3 className="text-xl font-playfair font-bold text-primary mb-8">Leads por Posada</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#4A3728", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#4A3728", fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: "#fcfaf0" }}
                contentStyle={{ 
                  borderRadius: "16px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Inter, sans-serif"
                }}
              />
              <Bar 
                dataKey="leads" 
                fill="#D4A373" 
                radius={[8, 8, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart - Device Distribution */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/5">
        <h3 className="text-xl font-playfair font-bold text-primary mb-8">Sistemas Operativos</h3>
        <div className="h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "16px", 
                  border: "none", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-primary/40">
            {donutData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
