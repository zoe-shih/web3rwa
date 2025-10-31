import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Lock, Coins, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const processingSteps = [
  { id: 1, label: "驗證資產狀態", icon: CheckCircle2 },
  { id: 2, label: "鎖定原始 NFT", icon: Lock },
  { id: 3, label: "鑄造資產碎片", icon: Coins },
  { id: 4, label: "發放 fNFT 代幣", icon: CheckCircle2 },
];

export default function FractionalizationProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);

  const { asset, fragmentValue, fragmentCount, valuePerFragment, remainingValue } =
    location.state || {};

  // 安全地獲取值，提供預設值
  const safeFragmentValue = fragmentValue || 0;
  const safeFragmentCount = fragmentCount || 0;
  const safeValuePerFragment = valuePerFragment || 0;

  useEffect(() => {
    if (!asset || !fragmentValue) {
      navigate("/my-assets");
      return;
    }
  }, [asset, fragmentValue, navigate]);

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    
    // Simulate processing
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            navigate("/fractionalization-success", {
              state: {
                asset,
                fragmentValue,
                fragmentCount,
                valuePerFragment,
                remainingValue,
              },
            });
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  };

  if (!asset) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        {/* Processing Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            {currentStep < processingSteps.length ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">正在處理碎片化...</h2>
          <p className="text-muted-foreground">
            {currentStep < processingSteps.length
              ? processingSteps[currentStep].label
              : "處理完成"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            {progress}% 完成
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {processingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 border border-primary/20"
                    : isCompleted
                    ? "bg-muted/50"
                    : "bg-muted/30"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary/50 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Asset Preview */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-4">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{asset.name}</p>
              <p className="text-sm text-muted-foreground">
                碎片化價值：${safeFragmentValue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">獲得碎片</p>
              <p className="font-bold text-primary">{safeFragmentCount} fNFT</p>
            </div>
          </div>
        </Card>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認資產碎片化</DialogTitle>
            <DialogDescription>
              您確定要將價值 ${safeFragmentValue.toLocaleString()} 的資產轉換為{" "}
              {safeFragmentCount} 個資產碎片嗎？
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">資產名稱</span>
                <span className="text-sm font-medium">{asset?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">碎片化價值</span>
                <span className="text-sm font-medium">
                  ${safeFragmentValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">碎片數量</span>
                <span className="text-sm font-medium text-primary">
                  {safeFragmentCount} fNFT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">每個碎片價值</span>
                <span className="text-sm font-medium">
                  ${safeValuePerFragment.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">重要提示：</strong>
                碎片化後，您的原始資產 NFT 將被鎖定託管，直到所有碎片被贖回或清算。
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => navigate("/my-assets")}
            >
              取消
            </Button>
            <Button onClick={handleConfirm}>確認並簽署</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
