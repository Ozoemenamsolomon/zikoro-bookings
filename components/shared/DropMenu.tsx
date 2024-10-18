import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";

export const DropMenu = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigerBtn}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("p-0", className)}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
