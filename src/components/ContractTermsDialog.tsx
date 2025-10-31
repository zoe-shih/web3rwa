import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface ContractTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ContractTermsDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ContractTermsDialogProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasScrolledToBottom(false);
    }
  }, [open]);

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement;
    const isAtBottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      toast({
        title: "感謝您的閱讀",
        description: "您現在可以確認已閱讀合約條款",
      });
    }
  };

  useEffect(() => {
    if (open) {
      const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.addEventListener('scroll', handleScroll);
        return () => {
          scrollViewport.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [open, hasScrolledToBottom]);

  const handleConfirm = () => {
    if (!hasScrolledToBottom) {
      toast({
        title: "請先閱讀完整合約",
        description: "請滾動至底部以確認您已閱讀所有條款",
        variant: "destructive",
      });
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            資產代幣化合約條款
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            請仔細閱讀以下合約條款，滾動至底部以確認閱讀完成
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 h-[400px]">
          <div className="space-y-6 pb-4">
            <section>
              <h3 className="text-lg font-bold mb-3">第十條：智慧財產權</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                標的資產之智慧財產權歸甲方所有。NFT 之鑄造不影響標的資產之智慧財產權歸屬。乙方就平台技術、系統及相關軟體保有完整之智慧財產權，甲方不得擅自複製、修改或散布。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">第十一條：合約終止</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                本合約於下列情形得終止：
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>雙方書面同意終止</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>一方嚴重違約，經催告仍未改善</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>標的資產滅失或喪失代幣化之適格性</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>法律或主管機關命令終止</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                合約終止後，已鑄造之 NFT 仍然有效，雙方就終止前已發生之權利義務仍應履行。
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-center font-bold text-lg mb-4">- 合約條款結束 -</p>
              <p className="text-center text-sm text-muted-foreground">
                請確認您已完整閱讀並理解以上所有條款
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 space-y-3 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full"
            size="lg"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasScrolledToBottom}
            className="w-full rounded-full font-semibold"
            size="lg"
          >
            我已仔細閱讀並完全理解上述合約條款
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTermsDialog;
