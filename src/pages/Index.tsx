import { useState } from "react";
import AssetSubmission from "@/components/AssetSubmission";
import AssetStatus from "@/components/AssetStatus";
import NFTPreview from "@/components/NFTPreview";
import NFTSuccess from "@/components/NFTSuccess";
import { Coins } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ONE-B</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {currentStep === 0 && (
            <AssetSubmission onSubmitSuccess={() => handleStepChange(1)} />
          )}
          {currentStep === 1 && (
            <AssetStatus onViewNFT={() => handleStepChange(2)} />
          )}
          {currentStep === 2 && (
            <NFTPreview onConfirm={() => handleStepChange(3)} />
          )}
          {currentStep === 3 && <NFTSuccess />}
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 RWA 資產代幣化平台. All rights reserved.</p>
          <p className="mt-2">Powered by Web3 Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
