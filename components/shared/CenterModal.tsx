'use client'
// Dialog: for center modal

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";


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
          <DialogContent className={className}>
            {children}
          </DialogContent>
        </Dialog>
      )
    }
    