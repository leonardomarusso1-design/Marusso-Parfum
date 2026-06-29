import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import OfferPage from "./pages/OfferPage";
import FAQ from "./pages/FAQ";
import ProductPage from "./pages/ProductPage";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import FloatingChat from "./components/FloatingChat";
import NewsletterPopup from "./components/NewsletterPopup";
import { useAnalytics } from "./hooks/useAnalytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produto/:id" component={ProductPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/oferta" component={OfferPage} />
      <Route path="/faq" component={FAQ} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  useAnalytics();
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <>
      <Toaster />
      {!isAdmin && <Header />}
      {!isAdmin && <NewsletterPopup />}
      <Router />
      {!isAdmin && <FloatingChat />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppInner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
