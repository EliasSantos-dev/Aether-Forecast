"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function GlassCard({ children, className, noPadding = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/10 shadow-2xl",
        noPadding ? "p-0" : "p-6 sm:p-8",
        className
      )}
      {...props}
    >
      {/* Camada de Ruído (Extraída do design Stitch) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-noise z-0" />
      
      {/* Conteúdo */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}