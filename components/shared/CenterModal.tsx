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
      <DialogContent className={cn("p-0 max-w-4xl w-full sm:max-h-[90vh] overflow-auto", className)}>
        <DialogTitle className="hidden"></DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
