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
import { Canvas as FabricCanvas } from "fabric";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DigitalSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DigitalSignatureDialog({
  open,
  onOpenChange,
  onConfirm,
}: DigitalSignatureDialogProps) {
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
      setHasSigned(false);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">數位簽名</DialogTitle>
          <DialogDescription>
            請在下方白色區域簽署您的姓名以完成合約簽署
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              使用滑鼠或觸控筆在下方區域簽名
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              清除
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} className="w-full cursor-crosshair" />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground">
              ⓘ 您的數位簽名將與合約一同加密儲存，並具有法律效力。簽署後，系統將產生簽名憑證並記錄於區塊鏈上。
            </p>
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
            disabled={!hasSigned}
            className="w-full sm:w-auto"
          >
            確認簽名
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
