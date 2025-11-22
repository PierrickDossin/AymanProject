import { Link, useLocation } from "react-router-dom";
import { Target, UtensilsCrossed, Dumbbell, LayoutDashboard } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/goals", icon: Target, label: "Goals" },
    { path: "/nutrition", icon: UtensilsCrossed, label: "Nutrition" },
    { path: "/training", icon: Dumbbell, label: "Training" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-card border-t border-border/30 z-50 shadow-medium backdrop-blur-lg">
      <div className="flex items-center justify-around h-20 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-b-full" />
              )}
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                isActive ? "bg-primary/20 scale-110" : "bg-transparent scale-100"
              }`}>
                <Icon 
                  className={`transition-all duration-300 ${
                    isActive ? "stroke-[2.5]" : "stroke-2"
                  }`} 
                  size={22} 
                />
              </div>
              <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${
                isActive ? "opacity-100" : "opacity-60"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
