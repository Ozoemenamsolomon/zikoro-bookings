'use client'
// Dialog: for center modal

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";


export const CenterModal = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string
}) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            {trigerBtn}
          </DialogTrigger>
          <DialogContent className={cn("p-0", className)}>
            {children}
          </DialogContent>
        </Dialog>
      )
    }
    