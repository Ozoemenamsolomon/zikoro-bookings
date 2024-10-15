'use client'
// for sidebar
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

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
        <DrawerContent>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }
  