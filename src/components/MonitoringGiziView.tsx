import React, { useState } from 'react';
import { MonitoringGizi, Sekolah, DashboardSettings } from '../types';
import { Activity, ShieldCheck, Zap, Award, Target, Flame, ChevronRight, HelpCircle } from 'lucide-react';

interface MonitoringGiziViewProps {
  giziList: MonitoringGizi[];
  sekolahList: Sekolah[];
  settings: DashboardSettings;
}

export default function MonitoringGiziView({
  giziList,
  sekolahList,
  settings
}: MonitoringGiziViewProps) {
  const [selectedSchool, setSelectedSchool] = useState('Semua');
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Filter nutrition logs
  const filteredGizi = selectedSchool === 'Semua'
    ? giziList
    : giziList.filter(g => g.id_sekolah === selectedSchool);

  // Core metrics calculated from filters
  const averageCalories = filteredGizi.length > 0 
    ? Math.round(filteredGizi.reduce((acc, curr) => acc + curr.rata_kalori, 0) / filteredGizi.length)
    : 615;

  const averageProtein = filteredGizi.length > 0
    ? Number((filteredGizi.reduce((acc, curr) => acc + curr.rata_protein, 0) / filteredGizi.length).toFixed(1))
    : 31.0;

  const averageCarbs = filteredGizi.length > 0
    ? Math.round(filteredGizi.reduce((acc, curr) => acc + curr.rata_karbohidrat, 0) / filteredGizi.length)
    : 71;

  const averageFats = filteredGizi.length > 0
    ? Math.round(filteredGizi.reduce((acc, curr) => acc + curr.rata_lemak, 0) / filteredGizi.length)
    : 16;

  // Standar Kemenkes RI target (taken from global settings or default standards)
  const targetCalorie = 650;
  const targetProtein = 30;
  const targetCarbs = 75;
  const targetFats = 18;

  // Historical compliance logs for Chart (Line Spline)
  // Let's draw 6 days data point for beautiful SVG Spline
  const calorieTrendPoints = [
    { label: 'Senin', val: 580 },
    { label: 'Selasa', val: 620 },
    { label: 'Rabu', val: 645 },
    { label: 'Kamis', val: 610 },
    { label: 'Jumat', val: 630 },
    { label: 'Sabtu', val: 650 }
  ];

  // SVG dimensions for Line Chart
  const svgW = 500;
  const svgH = 150;
  const paddingX = 40;
  const paddingY = 25;
  
  // Convert points to coordinates
  const coords = calorieTrendPoints.map((p, idx) => {
    const x = paddingX + (idx / (calorieTrendPoints.length - 1)) * (svgW - paddingX * 2);
    // scale y between 400 and 700 kcal
    const ratio = (p.val - 500) / (700 - 500); 
    const y = svgH - paddingY - ratio * (svgH - paddingY * 2);
    return { x, y, val: p.val, label: p.label };
  });

  // Generate Bezier path out of coordinate points
  const drawBezierPath = () => {
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i+1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  // Bezier Area polygon path to create background gradient fill
  const dBezier = drawBezierPath();
  const dArea = dBezier 
    ? `${dBezier} L ${coords[coords.length - 1].x} ${svgH - paddingY} L ${coords[0].x} ${svgH - paddingY} Z`
    : '';

  return (
    <div className="space-y-6" id="monitoring-gizi-view-root">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Activity className="text-emerald-600" />
            Rencana & Angka Pemenuhan Gizi Nasional
          </h2>
          <p className="text-sm text-gray-500">
            Audit kuantitatif dan kualitatif target angka kecukupan gizi (AKG) yang diawasi oleh Dinas Kesehatan & Puskemas.
          </p>
        </div>

        {/* School Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Pilih Sekolah:</span>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Sekolah (Baseline)</option>
            {sekolahList.map(s => (
              <option key={s.id_sekolah} value={s.id_sekolah}>{s.nama_sekolah}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Gizi Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Caloric compliance indicator */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-orange-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Flame size={12} /> Kalori Per Siswa
            </span>
            <span className="text-[10px] bg-orange-100 text-orange-850 px-2 py-0.5 rounded font-black font-mono">
              AKG: 650 kcal
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              {averageCalories} <span className="text-xs font-semibold text-gray-400">kcal</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, (averageCalories / targetCalorie) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Rasio kelayakan: <strong>{Math.round((averageCalories / targetCalorie) * 100)}%</strong> dari target minimum.</p>
        </div>

        {/* Protein compliance */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Award size={12} /> Protein Per Siswa
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black font-mono">
              AKG: 30 gr
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              {averageProtein} <span className="text-xs font-semibold text-gray-400">gr</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (averageProtein / targetProtein) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Rasio kelayakan: <strong className="text-blue-600">{Math.round((averageProtein / targetProtein) * 100)}%</strong> (Pencapaian Prima)</p>
        </div>

        {/* Carbohydrates */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Zap size={12} /> Karbohidrat
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded font-black font-mono">
              AKG: 75 gr
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              {averageCarbs} <span className="text-xs font-semibold text-gray-400">gr</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (averageCarbs / targetCarbs) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Suplai glukosa harian optimal siswa.</p>
        </div>

        {/* Fats */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Target size={12} /> Lemak Pangan
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-850 px-2 py-0.5 rounded font-black font-mono">
              AKG: 18 gr
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              {averageFats} <span className="text-xs font-semibold text-gray-400">gr</span>
            </h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (averageFats / targetFats) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Lemak baik (nabati & hewani fillet).</p>
        </div>
      </div>

      {/* Grid: Line Chart compliance + Double bar comparison chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart LEFT: Spline Line calorie compliance trend */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3">
          <div>
            <h4 className="font-bold text-gray-900 text-base font-display">Tren Rata-Rata Kalori Mingguan</h4>
            <p className="text-xs text-gray-500">Log konsumsi harian kalori seminggu terakhir terhadap benchmark minimum.</p>
          </div>

          {/* Interactive Custom SVG Spline Line Chart */}
          <div className="relative w-full border border-gray-100 rounded-xl p-2 bg-slate-50">
            <svg 
              viewBox={`0 0 ${svgW} ${svgH}`} 
              className="w-full h-auto overflow-visible"
            >
              <defs>
                {/* Gradient for area fill under path */}
                <linearGradient id="calorieGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2596be" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2596be" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Help lines */}
              <line x1={paddingX} y1={paddingY} x2={svgW - paddingX} y2={paddingY} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3" />
              <text x={paddingX - 10} y={paddingY + 3} textAnchor="end" className="text-[9px] font-bold fill-gray-400 font-mono">700 kcal</text>

              <line x1={paddingX} y1={svgH / 2} x2={svgW - paddingX} y2={svgH / 2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3" />
              <text x={paddingX - 10} y={svgH / 2 + 3} textAnchor="end" className="text-[9px] font-bold fill-gray-400 font-mono">600 kcal</text>

              <line x1={paddingX} y1={svgH - paddingY} x2={svgW - paddingX} y2={svgH - paddingY} stroke="#cbd5e1" strokeWidth="1" />
              <text x={paddingX - 10} y={svgH - paddingY + 3} textAnchor="end" className="text-[9px] font-bold fill-gray-400 font-mono">500 kcal</text>

              {/* Target benchmark red dashed line */}
              <line 
                x1={paddingX} 
                y1={svgH - paddingY - ((targetCalorie - 500) / 200) * (svgH - paddingY * 2)} 
                x2={svgW - paddingX} 
                y2={svgH - paddingY - ((targetCalorie - 500) / 200) * (svgH - paddingY * 2)} 
                stroke="#ef4444" 
                strokeWidth="1.5" 
                strokeDasharray="4"
                opacity="0.65"
              />

              {/* Gradient filled area */}
              {dArea && <path d={dArea} fill="url(#calorieGlow)" />}

              {/* Spline pathway line */}
              {dBezier && <path d={dBezier} fill="none" stroke="#2596be" strokeWidth="3" strokeLinecap="round" className="glow-emerald" />}

              {/* Custom dots interactive triggers */}
              {coords.map((pt, idx) => {
                const isHovered = hoveredNode === idx;
                return (
                  <g key={idx}>
                    {/* circular hover ring */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? 10 : 0} 
                      fill="#2596be" 
                      opacity="0.25"
                      className="transition-all duration-150"
                    />
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? 6 : 4} 
                      fill="#ffffff" 
                      stroke="#2596be" 
                      strokeWidth={3}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredNode(idx)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    {/* labels for axis x */}
                    <text 
                      x={pt.x} 
                      y={svgH - 6} 
                      textAnchor="middle" 
                      className="text-[9.5px] font-bold fill-gray-400 font-display"
                    >
                      {pt.label}
                    </text>

                    {/* Pop value label on top */}
                    {(isHovered || idx === coords.length - 1) && (
                      <g>
                        <rect 
                          x={pt.x - 22} 
                          y={pt.y - 25} 
                          width="44" 
                          height="18" 
                          rx="4" 
                          fill="#0f172a" 
                        />
                        <text 
                          x={pt.x} 
                          y={pt.y - 13} 
                          textAnchor="middle" 
                          className="text-[9px] font-bold fill-white font-mono"
                        >
                          {pt.val} kcal
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="absolute top-2.5 right-2.5 bg-red-100 text-[#7f1d1d] text-[8.5px] font-bold px-2 py-0.5 rounded border border-red-200">
              Target Minimum Kemenkes ({targetCalorie} kcal)
            </div>
          </div>
        </div>

        {/* Chart RIGHT: Double bar target vs actual */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3">
          <div>
            <h4 className="font-bold text-gray-900 text-base font-display">Target Gizi Kemenkes vs Realisasi</h4>
            <p className="text-xs text-gray-500">Perbandingan pergram macro nutrisi utama dalam porsi makan gratis terkelola.</p>
          </div>

          <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-slate-50">
            {/* Protein bar block */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">Protein (g)</span>
                <span className="text-slate-400 font-mono text-[11px]">Real: {averageProtein}g / Target: {targetProtein}g</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {/* Target bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(targetProtein / 100) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-gray-500 font-black tracking-widest leading-none">Target</span>
                </div>
                {/* Actual Realization bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(averageProtein / 100) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-white font-black tracking-widest leading-none">Pencapaian</span>
                </div>
              </div>
            </div>

            {/* Carbohydrates bar block */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">Karbohidrat (g)</span>
                <span className="text-slate-400 font-mono text-[11px]">Real: {averageCarbs}g / Target: {targetCarbs}g</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {/* Target */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(targetCarbs / 150) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-gray-500 font-black tracking-widest leading-none">Target</span>
                </div>
                {/* Actual */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(averageCarbs / 150) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-white font-black tracking-widest leading-none">Pencapaian</span>
                </div>
              </div>
            </div>

            {/* Fats bar block */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">Lemak (g)</span>
                <span className="text-slate-400 font-mono text-[11px]">Real: {averageFats}g / Target: {targetFats}g</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {/* Target */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(targetFats / 50) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-gray-500 font-black tracking-widest leading-none">Target</span>
                </div>
                {/* Actual */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(averageFats / 50) * 100}%` }}></div>
                  <span className="absolute left-2.5 top-0 text-[8px] text-white font-black tracking-widest leading-none">Pencapaian</span>
                </div>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold justify-end pt-1">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-purple-500 block rounded-xs"></span> Target Kemenkes
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-emerald-500 block rounded-xs"></span> Realisasi Program
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Audit compliance card banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/25 text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="text-base font-bold font-display">Standar Mutu & Higienitas Terakreditasi</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Setiap menu makanan melewati uji laboratorium mutu nutrisi pangan terakreditasi KAN, memastikan bebas pestisida, pengawet berbahaya, dan diolah secara steril.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-slate-400 text-xs py-1.5 px-3 border border-slate-800 bg-slate-950/60 rounded-xl font-mono">
          AKG No. 41/Dir-Kes/2026
        </div>
      </div>

    </div>
  );
}
