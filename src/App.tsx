import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";

// Version Next.js optimisée - Toasters gérés dans pages/_app.tsx
const App = () => (
  <TooltipProvider>
    <Index />
  </TooltipProvider>
);

export default App;
