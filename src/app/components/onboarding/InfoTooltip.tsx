import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex">
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
