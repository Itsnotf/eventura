import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function FlashToaster() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const seen = useRef(new Set<string>());

    useEffect(() => {
        if (flash?.success) {
            const key = `s:${flash.success}`;
            if (!seen.current.has(key)) {
                seen.current.add(key);
                toast.success(flash.success);
            }
        }
        if (flash?.error) {
            const key = `e:${flash.error}`;
            if (!seen.current.has(key)) {
                seen.current.add(key);
                toast.error(flash.error);
            }
        }
    }, [flash]);

    return null;
}
