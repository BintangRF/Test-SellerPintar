import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomPopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function CustomPopover({
  trigger,
  content,
  side = "bottom",
  align = "center",
}: CustomPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="bg-custom-white !p-0"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
