import { usePage } from "@inertiajs/react";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface PageProps {
    flash: {
        message: string;
    };
}
export function FlashToast() {
    const { flash } = usePage().props as unknown as PageProps;

    useEffect(() => {
        if (!flash?.message) return;


        const msg: string = flash.message.toLowerCase();

        if (msg.includes("added") || msg.includes("created")) {
            toast.success(flash.message, {
                position: 'top-center',
                duration: 2000,
            });
            return;
        }

        if (msg.includes("updated")) {
            toast.info(flash.message, {
                position: 'top-center',
                duration: 2000,
            });
            return;
        }

        if (msg.includes("deleted") || msg.includes("removed")) {
            toast.error(flash.message, {
                icon: <Trash className="size-4 shrink-0" />,
                position: 'top-center',
                duration: 2000,
            });
            return;
        }

        toast(flash.message);
    }, [flash]);

    return null;
}