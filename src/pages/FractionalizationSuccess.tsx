import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FractionalizationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { asset, fragmentValue, fragmentCount, valuePerFragment, remainingValue } =
    location.state || {};

  // 安全地獲取值，提供預設值
  const safeFragmentValue = fragmentValue || 0;
  const safeFragmentCount = fragmentCount || 0;
  const safeValuePerFragment = valuePerFragment || 0;
  const safeRemainingValue = remainingValue || 0;
  const assetValue = asset ? (asset.valuation || asset.value || 0) : 0;

  useEffect(() => {
    if (!asset || !fragmentValue) {
      navigate("/my-assets");
      return;
    }
  }, [asset, fragmentValue, navigate]);

  if (!asset) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            資產碎片化成功！
          </h1>
          <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            您已成功獲得 {safeFragmentCount} 個資產碎片 (fNFT)
          </p>
        </div>

        {/* Main Info Card */}
        <Card className="p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{asset.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{asset.type}</p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">碎片化價值：</p>
                  <p className="text-lg font-semibold text-primary">
                    ${safeFragmentValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">獲得碎片</p>
                  <p className="text-xl font-bold text-primary">{safeFragmentCount} fNFT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">碎片化價值</p>
              <p className="text-lg font-semibold text-primary">
                ${safeFragmentValue.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">每個碎片價值</p>
              <p className="text-lg font-semibold">
                ${safeValuePerFragment.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">資產總價值</p>
              <p className="text-lg font-semibold">
                ${assetValue.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">剩餘未使用價值</p>
              <p className="text-lg font-semibold">
                ${safeRemainingValue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="p-4 mb-6 bg-blue-500/10 border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            接下來您可以：
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• 使用這些資產碎片 (fNFT) 申請借款</li>
            <li>• 在儀表板中查看您的碎片資產</li>
            <li>• 原始資產 NFT 已被安全鎖定託管</li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <Button
            size="lg"
            onClick={() =>
              navigate("/loan-setup", {
                state: {
                  asset: {
                    ...asset,
                    name: `${asset.name} (碎片化資產)`,
                    value: safeFragmentValue,
                    valuation: safeFragmentValue,
                    type: "fNFT",
                    fragmentCount: safeFragmentCount,
                    isFragmented: true,
                  },
                },
              })
            }
            className="w-full group"
          >
            使用碎片申請借款
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/my-assets")}
            className="w-full"
          >
            返回資產儀表板
          </Button>
        </div>
      </div>
    </div>
  );
}
