'use client'
// Dialog: for center modal

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";


export const CenterModal = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className, disabled}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string,
    disabled?:boolean,
}) => {
      return (
        <Dialog>
          <DialogTrigger disabled={disabled} asChild>
            {trigerBtn}
          </DialogTrigger>
          <DialogContent className={cn("p-0", className)}>
            <DialogTitle className="hidden"></DialogTitle>
            {children}
          </DialogContent>
        </Dialog>
      )
    }
    