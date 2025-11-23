import WeatherDashboard from "@/components/aether/WeatherDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aether | Dashboard Climático",
  description: "Interface climática imersiva com animações fluidas.",
};

export default function Page() {
  return (
    <main className="bg-bg-dark min-h-screen text-white selection:bg-white selection:text-black">
      <WeatherDashboard />
    </main>
  );
}