import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";

export const DropOver = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigerBtn}
      </PopoverTrigger>
      <PopoverContent className={cn(`w-80 `, className)}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
