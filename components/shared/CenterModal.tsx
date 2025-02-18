'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";

export const CenterModal = ({
  trigerBtn = <Button variant="outline">Open</Button>,
  children,
  className,
  isOpen,
  onOpenChange,
  disabled,
}: {
  trigerBtn: React.ReactNode
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger disabled={disabled} asChild>
        {trigerBtn}
      </DialogTrigger>
      <DialogContent className={cn("p-0 w-full overflow-hidden max-w-4xl",className)}>
        <div className={cn("p-0 w-full max-h-screen sm:max-h-[90vh] overflow-auto no-scrollbar", className)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
