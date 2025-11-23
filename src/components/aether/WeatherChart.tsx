"use client";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react"; // Importação adicionada

export default function WeatherChart() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-end px-2 mb-4">
        <div>
          <div className="flex items-baseline gap-2">
            {/* Dados estáticos do gráfico (apenas visual) */}
            <span className="text-5xl font-bold text-white tracking-tighter">15°C</span>
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              {/* Ícone corrigido aqui 👇 */}
              <ArrowUp size={16} strokeWidth={2.5} /> 
              2%
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">Próximas 24 Horas</p>
        </div>
        
        <div className="hidden sm:flex bg-black/30 rounded-full p-1">
          <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">Hourly</button>
          <button className="px-4 py-1.5 rounded-full text-gray-400 text-xs font-medium hover:text-white transition-colors">Daily</button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[150px] w-full">
        <svg viewBox="0 0 472 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="paint0_linear_chart" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_chart" x1="0" y1="75" x2="472" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          
          <motion.path 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "bottom" }}
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" 
            fill="url(#paint0_linear_chart)" 
          />
          
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" 
            stroke="url(#paint1_linear_chart)" 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        
        <div className="flex justify-between mt-2 px-1">
          {['Now', '3pm', '6pm', '9pm', '12am', '3am', '6am'].map((label, i) => (
            <span key={i} className="text-xs font-medium text-gray-500">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}