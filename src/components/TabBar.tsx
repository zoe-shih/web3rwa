import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Briefcase, Banknote } from "lucide-react";

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "wallet",
      label: "錢包",
      icon: Wallet,
      path: "/wallet-dashboard",
    },
    {
      id: "assets",
      label: "我的NFT",
      icon: Briefcase,
      path: "/my-assets",
    },
    {
      id: "loans",
      label: "貸款",
      icon: Banknote,
      path: "/my-loans",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/wallet-dashboard") {
      return location.pathname === "/wallet-dashboard";
    }
    if (path === "/asset-tokenization") {
      return location.pathname === "/" || location.pathname === "/asset-tokenization";
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
