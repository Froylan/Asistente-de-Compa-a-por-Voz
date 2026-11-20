import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CheckCircle2, TrendingUp, AlertCircle, Calendar, Award } from 'lucide-react';
import { Medication } from '../types';

export interface AdherenceDay {
  day: string;
  date: string;
  tomadas: number;
  pendientes: number;
  adherencia: number; // percentage
}

interface MedicationAdherenceChartProps {
  medications?: Medication[];
  data?: AdherenceDay[];
  overallRate?: number;
  streakDays?: number;
}

const DEFAULT_HISTORY: AdherenceDay[] = [
  { day: 'Vie 6', date: '6 Nov', tomadas: 3, pendientes: 0, adherencia: 100 },
  { day: 'Sáb 7', date: '7 Nov', tomadas: 3, pendientes: 0, adherencia: 100 },
  { day: 'Dom 8', date: '8 Nov', tomadas: 2, pendientes: 1, adherencia: 67 },
  { day: 'Lun 9', date: '9 Nov', tomadas: 3, pendientes: 0, adherencia: 100 },
  { day: 'Mar 10', date: '10 Nov', tomadas: 3, pendientes: 0, adherencia: 100 },
  { day: 'Mié 11', date: '11 Nov', tomadas: 3, pendientes: 0, adherencia: 100 },
  { day: 'Hoy', date: '12 Nov', tomadas: 2, pendientes: 1, adherencia: 67 },
];

export const MedicationAdherenceChart: React.FC<MedicationAdherenceChartProps> = ({
  medications,
  data: propData,
  overallRate: propOverallRate,
  streakDays: propStreakDays = 4,
}) => {
  const [historyData, setHistoryData] = useState<AdherenceDay[]>(propData || DEFAULT_HISTORY);
  const [streakDays, setStreakDays] = useState<number>(propStreakDays);

  useEffect(() => {
    if (propData) return;
    fetch('/api/medications/history')
      .then((r) => r.json())
      .then((res) => {
        if (res && Array.isArray(res.history)) {
          setHistoryData(res.history);
        }
        if (typeof res?.streakDays === 'number') {
          setStreakDays(res.streakDays);
        }
      })
      .catch(() => {
        // Keep fallback default history gracefully
      });
  }, [propData]);

  // Sync "Hoy" bar dynamically with live medications state if provided
  const syncedData = historyData.map((item, index) => {
    if (index === historyData.length - 1 && medications && medications.length > 0) {
      const takenToday = medications.filter((m) => m.takenToday).length;
      const pendingToday = medications.length - takenToday;
      const adherenceToday = Math.round((takenToday / medications.length) * 100);
      return {
        ...item,
        tomadas: takenToday,
        pendientes: pendingToday,
        adherencia: adherenceToday,
      };
    }
    return item;
  });

  const totalTaken = syncedData.reduce((acc, curr) => acc + curr.tomadas, 0);
  const totalDoses = syncedData.reduce((acc, curr) => acc + curr.tomadas + curr.pendientes, 0);
  const computedOverallRate =
    propOverallRate ?? (totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Header and key metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Seguimiento Farmacológico · Últimos 7 Días
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Historial de Adherencia a Medicinas de Doña Lupita
          </h3>
          <p className="text-sm font-semibold text-slate-500">
            Registro determinista con confirmación táctil o por voz en la tableta
          </p>
        </div>

        {/* Big Percentage Badge */}
        <div className="flex items-center gap-3 bg-emerald-50/80 border-2 border-emerald-200 px-5 py-3 rounded-2xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase">Apego Semanal</span>
            <div className="text-2xl font-black text-emerald-900 tabular-nums">
              {computedOverallRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Dosis Tomadas</p>
            <p className="text-lg font-black text-slate-900 tabular-nums">
              {totalTaken} de {totalDoses} dosis
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Racha de Cumplimiento</p>
            <p className="text-lg font-black text-slate-900 tabular-nums">
              {streakDays} días consecutivos
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Estado Clínico</p>
            <p className="text-lg font-black text-emerald-800">
              {computedOverallRate >= 85 ? 'Excelente control' : 'Seguimiento activo'}
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Data Visualization */}
      <div className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={syncedData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                unit="%"
                tick={{ fill: '#2563EB', fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as AdherenceDay;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-extrabold text-sm text-amber-300">{d.day} ({d.date})</p>
                        <p className="font-semibold text-emerald-400">✓ {d.tomadas} pastillas tomadas</p>
                        {d.pendientes > 0 && (
                          <p className="font-semibold text-amber-300">⚠️ {d.pendientes} pendiente / por tomar</p>
                        )}
                        <p className="text-slate-300 pt-1 border-t border-slate-700 font-bold">
                          Adherencia: {d.adherencia}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Bar
                yAxisId="left"
                name="Dosis Tomadas"
                dataKey="tomadas"
                fill="#059669"
                radius={[8, 8, 0, 0]}
                barSize={28}
              />
              <Bar
                yAxisId="left"
                name="Pendientes / Por Tomar"
                dataKey="pendientes"
                fill="#FBBF24"
                radius={[8, 8, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="right"
                name="% de Apego"
                type="monotone"
                dataKey="adherencia"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2563EB' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown by Medication Details */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Detalle por Medicamento
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 truncate">Losartán (Presión)</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">100%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-emerald-500 rounded-full" />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">7 de 7 tomas completas</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 truncate">Calcio con Vitamina D</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">100%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-emerald-500 rounded-full" />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">7 de 7 tomas completas</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 truncate">Gotas de Ojos</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">71%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-[71%] h-full bg-amber-500 rounded-full" />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">5 de 7 tomas completas</p>
          </div>
        </div>
      </div>

      {/* Clinical family tip */}
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3 text-xs sm:text-sm font-semibold text-emerald-950">
        <AlertCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          <strong>Resumen para el médico y familia:</strong> Doña Lupita mantiene una excelente regularidad en sus medicamentos de la mañana y de la tarde. Berna recuerda amablemente las dosis pendientes por voz.
        </p>
      </div>
    </div>
  );
};
