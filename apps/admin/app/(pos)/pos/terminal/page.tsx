'use client';

import { useRouter } from 'next/navigation';
import { usePos } from '@/context/PosContext';
import { useEffect } from 'react';
import PosView from '@/components/pos/PosView';
import { Spinner } from '@material-tailwind/react';

export default function PosTerminalPage() {
    const { shift, isLoading } = usePos();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !shift) {
            router.replace('/pos');
        }
    }, [shift, isLoading, router]);

    if (isLoading || !shift) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#020617]">
                <Spinner className="h-12 w-12 text-blue-500" onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined} />
            </div>
        );
    }

    return <PosView />;
}
