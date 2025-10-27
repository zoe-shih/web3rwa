import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Canvas as FabricCanvas } from "fabric";
import { Eraser, Pen, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DigitalSigningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DigitalSigningDialog({
  open,
  onOpenChange,
  onConfirm,
}: DigitalSigningDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || !open) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 200,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 2;

    canvas.on("path:created", () => {
      setHasSigned(true);
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, [open]);

  const handleClear = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.backgroundColor = "#ffffff";
    fabricCanvasRef.current.renderAll();
    setHasSigned(false);
    toast({
      title: "簽名已清除",
      description: "請重新簽名",
    });
  };

  const handleConfirm = () => {
    if (!agreed) {
      toast({
        title: "請勾選同意條款",
        description: "您必須閱讀並同意條款才能繼續",
        variant: "destructive",
      });
      return;
    }

    if (!hasSigned) {
      toast({
        title: "請完成簽名",
        description: "請在簽名區域完成您的數位簽名",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "簽約成功",
      description: "您的數位簽名已確認",
    });
    
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">線上簽約</DialogTitle>
          <DialogDescription>
            請仔細閱讀以下合約條款，並完成數位簽名
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">資產代幣化合約條款</h3>
            <ScrollArea className="h-48 border rounded-lg p-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <section>
                  <h4 className="font-semibold text-foreground mb-2">第一條：合約目的</h4>
                  <p>
                    本合約旨在規範雙方就實體資產（以下簡稱「標的資產」）進行代幣化（Tokenization）之權利義務關係。標的資產將透過區塊鏈技術鑄造為不可替代代幣（NFT），以確保資產所有權的數位化記錄及可追溯性。
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第二條：資產描述與估值</h4>
                  <p>
                    標的資產之詳細資訊、估值報告及相關證明文件已由甲方提供，並經乙方審核確認。資產估值由專業第三方鑑價機構出具，僅供參考，不構成任何投資建議或保證。
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第三條：NFT 鑄造與所有權</h4>
                  <p>
                    經雙方確認後，乙方將為標的資產鑄造 NFT，該 NFT 將儲存於以太坊區塊鏈上，並採用 ERC-721 標準。NFT 之所有權屬於甲方，甲方有權依法自由轉讓、出售或抵押該 NFT。
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第四條：平台服務費用</h4>
                  <p>
                    甲方同意支付乙方以下費用：
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>資產審核費：依資產類型及複雜度收取</li>
                    <li>NFT 鑄造費：包含智能合約部署及鏈上交易費用</li>
                    <li>平台維護費：按年度收取，用於系統維護及技術支援</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第五條：資料保護與隱私</h4>
                  <p>
                    乙方承諾依據相關法律法規保護甲方之個人資料及資產資訊，除法律規定或甲方同意外，不得向第三方揭露。區塊鏈上之公開資訊將依最小揭露原則處理。
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第六條：免責聲明</h4>
                  <p>
                    乙方對以下情形不承擔責任：
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>區塊鏈網路故障、癱瘓或其他不可抗力因素</li>
                    <li>標的資產市場價值波動或貶值</li>
                    <li>因甲方私鑰遺失、洩露導致之損失</li>
                    <li>第三方平台或服務之技術問題</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第七條：爭議解決</h4>
                  <p>
                    因本合約發生之爭議，雙方應本於誠信原則協商解決。協商不成時，同意以中華民國法律為準據法，並以台灣台北地方法院為第一審管轄法院。
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-foreground mb-2">第八條：合約效力</h4>
                  <p>
                    本合約經雙方數位簽署後生效，並與紙本合約具有同等法律效力。任何修改或補充需經雙方書面同意。
                  </p>
                </section>
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label
              htmlFor="agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              我已仔細閱讀並完全理解上述合約條款，同意受其約束
            </Label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">數位簽名</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                清除
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              請在下方白色區域使用滑鼠或觸控筆簽署您的姓名
            </p>
            <div className="border-2 border-dashed border-border rounded-lg overflow-hidden">
              <canvas ref={canvasRef} className="w-full cursor-crosshair" />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!agreed || !hasSigned}
            className="w-full sm:w-auto"
          >
            確認簽約
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
