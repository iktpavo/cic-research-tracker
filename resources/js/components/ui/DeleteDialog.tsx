

import { Button } from "./button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from './alert-dialog';
import { TriangleAlertIcon } from "lucide-react";


interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
}

export function DeleteDialog({ open, onOpenChange, onConfirm, title, message, loading = false }: DeleteDialogProps) {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className='items-center'>
                    <div className='bg-destructive/10 mx-auto   mb-2 flex size-12 items-center justify-center rounded-full'>
                        <TriangleAlertIcon className='text-destructive size-6' />
                    </div>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>{message}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>

                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

