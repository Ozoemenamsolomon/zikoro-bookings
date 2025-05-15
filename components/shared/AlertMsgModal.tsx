"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const AlertMsgModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const msg = searchParams.get("msg");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (msg) setIsOpen(true);
  }, [msg]);

  const handleClose = () => {
    setIsOpen(false);
    // router.replace("/courses"); 
  };

  if (!msg) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        {/* <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button> */}

        <DialogHeader>
          <DialogTitle>Heads up 👋</DialogTitle>
          <DialogDescription>{msg}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Dismiss
          </Button>
          {/* <Button onClick={() => router.push("/courses")}>
            Browse Courses
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
