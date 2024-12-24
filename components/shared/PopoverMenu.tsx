import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const PopoverMenu = ({
  trigerBtn = <Button variant="outline">Open</Button>,
  children,
  className,
  align,
}: {
  trigerBtn: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "center" | "end" | "start";
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigerBtn}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("p-0 rounded-md shadow-md", className)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
