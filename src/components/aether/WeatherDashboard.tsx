"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Wind, Thermometer, Eye } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import WeatherChart from "./WeatherChart";
import CitySearch from "./CitySearch";
import WeatherHero from "./WeatherHero"; // Novo componente
import { fetchWeather, WeatherData, CitySuggestion } from "@/lib/weatherApi";

export default function WeatherDashboard() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca inicial (São Paulo)
  useEffect(() => {
    // Dados mockados para a primeira carga para ser rápido, ou chame a API
    const initialCity: CitySuggestion = { 
      id: 0, name: "São Paulo", country: "Brasil", latitude: -23.55, longitude: -46.63 
    };
    handleSelectCity(initialCity);
  }, []);

  const handleSelectCity = async (city: CitySuggestion) => {
    setLoading(true);
    const result = await fetchWeather(city);
    if (result) setData(result);
    setLoading(false);
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center pt-12 pb-12 px-4 font-manrope overflow-hidden">
      
      {/* Background Dinâmico */}
      <motion.div 
        animate={{ 
          background: `radial-gradient(circle at 50% -20%, ${
            data?.condition === 'Ensolarado' ? '#fbbf24' : '#6366f1'
          } 0%, transparent 50%)` 
        }}
        className="absolute top-0 left-0 right-0 h-[80vh] opacity-15 blur-[120px] transition-all duration-1000 pointer-events-none z-0"
      />

      <div className="z-10 w-full max-w-6xl space-y-8">
        
        {/* Header com Autocomplete */}
        <div className="space-y-6 text-center">
          <h2 className="font-playfair text-3xl font-bold text-white tracking-tight">Aether <span className="text-gray-600 italic">Forecast</span></h2>
          <CitySearch onSelectCity={handleSelectCity} />
        </div>

        <AnimatePresence mode="wait">
          {data && !loading && (
            <motion.div
              key={data.city}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Novo Card Hero Rico */}
              <WeatherHero data={data} />

              {/* Grid Inferior */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <GlassCard className="h-full min-h-[300px]">
                     <WeatherChart /> 
                  </GlassCard>
                </div>

                {/* Cards de Detalhes */}
                <div className="grid grid-cols-2 gap-4">
                  <DetailCard 
                    icon={<Droplets size={20} />} 
                    label="Umidade" 
                    value={`${data.humidity}%`} 
                    color="text-blue-400" 
                    bgColor="bg-blue-500/20"
                  />
                  <DetailCard 
                    icon={<Wind size={20} />} 
                    label="Vento" 
                    value={`${data.wind} km/h`} 
                    color="text-emerald-400" 
                    bgColor="bg-emerald-500/20"
                  />
                  <DetailCard 
                    icon={<Thermometer size={20} />} 
                    label="Sensação" 
                    value={`${data.feelsLike}°`} 
                    color="text-orange-400" 
                    bgColor="bg-orange-500/20"
                  />
                  <DetailCard 
                    icon={<Eye size={20} />} 
                    label="Visibilidade" 
                    value={data.visibility} 
                    color="text-purple-400" 
                    bgColor="bg-purple-500/20"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Pequeno sub-componente para evitar repetição
function DetailCard({ icon, label, value, color, bgColor }: any) {
  return (
    <GlassCard className="flex flex-col justify-center gap-1 p-5 hover:bg-white/10 transition-colors" noPadding>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-full ${bgColor} ${color}`}>
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white pl-1">{value}</p>
    </GlassCard>
  );
}