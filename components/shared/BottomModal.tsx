'use client'
// for sidebar
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

export const BottomModal = ({
    trigerBtn=<Button variant="outline">Open</Button>, 
    children, className}
    :{
    trigerBtn:React.ReactNode;
    children:React.ReactNode;
    className?:string
}) => {

    return (
      <Drawer>
        <DrawerTrigger asChild>
          {trigerBtn}
        </DrawerTrigger>
        <DrawerContent className={cn("p-0", className)} >
          {children}
        </DrawerContent>
      </Drawer>
    )
  }
  