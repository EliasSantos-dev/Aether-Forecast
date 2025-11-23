"use client";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities, CitySuggestion } from "@/lib/weatherApi";
import { motion, AnimatePresence } from "framer-motion";

interface CitySearchProps {
  onSelectCity: (city: CitySuggestion) => void;
}

export default function CitySearch({ onSelectCity }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce para não chamar a API a cada letra
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 500); // Espera 500ms após parar de digitar

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: CitySuggestion) => {
    onSelectCity(city);
    setQuery(""); // Limpa ou mantém o nome, sua escolha
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative flex items-center group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          placeholder="Buscar cidade (ex: Curitiba, Lisboa...)"
          className="relative w-full bg-[#0A0A0A]/90 border border-white/10 text-white text-sm rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-gray-600 font-manrope backdrop-blur-xl"
        />
        
        <div className="absolute left-4 text-gray-400">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </div>

      {/* Dropdown de Sugestões */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#111]/90 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto custom-scrollbar"
          >
            {suggestions.map((city) => (
              <li key={city.id}>
                <button
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-6 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 group border-b border-white/5 last:border-0"
                >
                  <div className="p-2 bg-white/5 rounded-full text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{city.name}</p>
                    <p className="text-xs text-gray-500">
                      {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}