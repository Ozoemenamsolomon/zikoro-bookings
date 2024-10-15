'use client'
// Sheet: for sidebar

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export const RightModal = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string
}) => {
      return (
        <Sheet>
          <SheetTrigger asChild>
            {trigerBtn}
          </SheetTrigger>
          <SheetContent className={className}>
            {children}
          </SheetContent>
        </Sheet>
      )
    }
    