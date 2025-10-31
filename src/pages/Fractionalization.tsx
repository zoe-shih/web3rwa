import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function Fractionalization() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetId } = useParams();
  
  // Get asset data from navigation state or use mock data
  const asset = location.state?.asset || {
    id: assetId || "1",
    name: "台北市信義區豪宅",
    type: "房地產",
    valuation: 6400000,
    image: "/placeholder.svg",
  };

  const assetValue = asset.valuation || asset.value || 0;

  const maxLTVRatio = 0.8; // 最高可貸比例 80%
  const maxFragmentValue = assetValue * maxLTVRatio;
  const fragmentsPerMillion = 50; // 每 100 萬產生 50 個碎片

  const [fragmentValue, setFragmentValue] = useState(2000000); // 預設 200 萬

  // 計算碎片數量
  const fragmentCount = Math.floor((fragmentValue / 1000000) * fragmentsPerMillion);
  const valuePerFragment = fragmentCount > 0 ? fragmentValue / fragmentCount : 0;
  const remainingValue = assetValue - fragmentValue;
  const fragmentPercentage = (fragmentValue / assetValue) * 100;

  const handleContinue = () => {
    navigate("/fractionalization-processing", {
      state: {
        asset,
        fragmentValue,
        fragmentCount,
        valuePerFragment,
        remainingValue,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-assets")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">資產碎片化設定</h1>
            <p className="text-sm text-muted-foreground mt-1">
              選擇您想用於借款的資產價值
            </p>
          </div>
        </div>

        {/* Asset Info Card */}
        <Card className="p-6 mb-6 bg-card/50 backdrop-blur">
          <div className="flex items-start gap-4">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{asset.name}</h3>
                  <p className="text-sm text-muted-foreground">{asset.type}</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">資產總價值</p>
                  <p className="text-lg font-bold text-primary">
                    ${assetValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">最高可用價值</p>
                  <p className="text-lg font-bold">
                    ${maxFragmentValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Fractionalization Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-6">您想使用多少價值來進行借款？</h3>

          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary">
                ${fragmentValue.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                {fragmentPercentage.toFixed(1)}% 的資產價值
              </span>
            </div>
            
            <Slider
              value={[fragmentValue]}
              onValueChange={(value) => setFragmentValue(value[0])}
              min={100000}
              max={maxFragmentValue}
              step={100000}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$100,000</span>
              <span>${maxFragmentValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-base text-muted-foreground mb-4">
              碎片化方案預覽
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">資產總價值</p>
                <p className="text-lg font-semibold">
                  ${assetValue.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">本次使用價值</p>
                <p className="text-lg font-semibold text-primary">
                  ${fragmentValue.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">獲得碎片數量</p>
                <p className="text-lg font-semibold text-primary">
                  {fragmentCount} 個 fNFT
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">每個碎片價值</p>
                <p className="text-lg font-semibold">
                  ${valuePerFragment.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <p className="text-xs text-muted-foreground">剩餘未使用價值</p>
                <p className="text-lg font-semibold">
                  ${remainingValue.toLocaleString()} ({((remainingValue / assetValue) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">說明：</strong>
              碎片化後，您的原始資產 NFT 將被鎖定託管。您將獲得 {fragmentCount} 個資產碎片代幣 (fNFT)，
              可用於申請借款。如果無法還款，融資公司將清算這些 fNFT。
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/my-assets")}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            disabled={fragmentValue < 100000}
          >
            下一步：確認碎片化
          </Button>
        </div>
      </div>
    </div>
  );
}
