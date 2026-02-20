import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 noise-overlay">
      <div className="text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="text-[120px] sm:text-[160px] font-display font-bold leading-none gradient-text mb-4" style={{ filter: 'blur(0.5px)' }}>
            404
          </h1>
          <p className="text-xl font-heading font-bold text-muted-foreground mb-2">Block Not Found</p>
          <p className="text-sm text-muted-foreground mb-8">This transaction doesn't exist on the blockchain.</p>
          <Link to="/">
            <Button size="lg" className="btn-primary-glow rounded-full">
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
