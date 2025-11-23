"use client";
import { motion } from "framer-motion";
import { Sun, CloudRain, Wind, Sunrise, Sunset, Gauge, Leaf, CloudDrizzle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/lib/weatherApi";

export default function WeatherHero({ data }: { data: WeatherData }) {
  const getAqiColor = (aqi: number) => {
    if (aqi <= 20) return "text-emerald-400";
    if (aqi <= 40) return "text-yellow-400";
    if (aqi <= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getAqiLabel = (aqi: number) => {
    if (aqi <= 20) return "Excelente";
    if (aqi <= 40) return "Bom";
    if (aqi <= 60) return "Moderado";
    return "Ruim";
  };

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
        data.condition === 'Ensolarado' ? 'from-yellow-500/30 to-transparent' : 'from-blue-500/30 to-transparent'
      } pointer-events-none transition-colors duration-1000`} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 py-6 px-4">
        
        {/* Esquerda: Infos */}
        <div className="text-center lg:text-left space-y-1">
          <div className="flex gap-2 mb-4 justify-center lg:justify-start flex-wrap">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-300">Ao Vivo</span>
            </motion.div>

            {/* Badge Chance de Chuva */}
            {data.chanceOfRain > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"
              >
                <CloudDrizzle size={14} />
                <span className="text-xs font-mono font-bold">{data.chanceOfRain}% Chuva</span>
              </motion.div>
            )}
          </div>
          
          <h1 className="font-playfair text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none">
            {data.city}
          </h1>
          <p className="text-gray-400 text-lg font-medium flex items-center justify-center lg:justify-start gap-2">
            {data.country} <span className="w-1 h-1 bg-gray-600 rounded-full"/> {data.description}
          </p>
        </div>

        {/* Centro: Clima */}
        <div className="flex items-center gap-6">
          <div className="drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {data.condition === "Ensolarado" ? (
              <Sun size={100} className="text-yellow-400 animate-spin-slow" />
            ) : data.condition === "Chuvoso" ? (
              <CloudRain size={100} className="text-blue-400" />
            ) : (
              <Wind size={100} className="text-gray-400" />
            )}
          </div>
          <div className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            {data.temp}°
          </div>
        </div>

        {/* Direita: Grid de Extras */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
          {/* AQI */}
          <div className="bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center min-w-[100px]">
            <Leaf size={20} className={`mb-1 ${getAqiColor(data.airQuality)}`} />
            <span className="text-xs text-gray-500 font-bold uppercase">Ar (AQI)</span>
            <span className="text-white font-bold">{data.airQuality}</span>
            <span className={`text-[10px] ${getAqiColor(data.airQuality)}`}>{getAqiLabel(data.airQuality)}</span>
          </div>

          {/* Nascer */}
          <div className="bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
            <Sunrise size={20} className="text-orange-300 mb-1" />
            <span className="text-xs text-gray-500 font-bold uppercase">Nascer</span>
            <span className="text-white font-bold">{data.sunrise}</span>
          </div>

          {/* Pôr */}
          <div className="bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
            <Sunset size={20} className="text-purple-300 mb-1" />
            <span className="text-xs text-gray-500 font-bold uppercase">Pôr</span>
            <span className="text-white font-bold">{data.sunset}</span>
          </div>

          {/* Pressão */}
          <div className="bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
            <Gauge size={20} className="text-blue-300 mb-1" />
            <span className="text-xs text-gray-500 font-bold uppercase">Pressão</span>
            <span className="text-white font-bold text-sm">{data.pressure}</span>
          </div>
        </div>

      </div>
    </GlassCard>
  );
}