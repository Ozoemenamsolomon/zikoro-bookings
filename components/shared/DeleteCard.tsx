'use client'

import { AlertTriangle, Loader2 } from "lucide-react";
import { CenterModal } from "./CenterModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

interface ConfirmDeleteCardProps {
  text?: string;
  onDelete:  () => Promise<void>;
  onCancel?: () => void;
  trigger?: React.ReactNode
}

export default function DeleteCard({ text, onDelete, onCancel, trigger }: ConfirmDeleteCardProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const deleteItem = async() => {
        try {
            setLoading(true)
            await onDelete()
        } catch (error) {
            console.log(error)
            toast.error('Request was unsuccessful, try again')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <CenterModal
        isOpen={open}
        onOpenChange={setOpen}
        className="max-w-sm p-4 text-center space-y-3"
        trigerBtn={
            trigger ? trigger :
            'Delete'
        }
    >
      <div className="flex items-center justify-center gap-3 text-red-600">
        <AlertTriangle className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
      </div>

      <p className="text-sm text-gray-700">
        {
            text ?
            <>Are you sure you want to delete <span className="font-medium">{text}</span>? This action cannot be undone.</> 
            :
            <>Are you sure you want to delete the item? This action cannot be undone.</>
        }
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <Button
            variant={'outline'}
            disabled={loading}
          onClick={()=>{
            onCancel&&onCancel
            setOpen(false)
        }}
          className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
        >
          Cancel
        </Button>
        <Button
            variant={'destructive'}
            disabled={loading}
            onClick={deleteItem}
            className="  bg-red-600 text-white hover:bg-red-700 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : null } Delete  
        </Button>
      </div>
    </CenterModal>
  );
}
