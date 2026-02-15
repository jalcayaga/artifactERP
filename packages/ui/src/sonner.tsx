"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-[#1a2537] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl",
                    description: "group-[.toast]:text-[#7b8893]",
                    actionButton:
                        "group-[.toast]:bg-[#00a1ff] group-[.toast]:text-white group-[.toast]:rounded-lg",
                    cancelButton:
                        "group-[.toast]:bg-white/5 group-[.toast]:text-[#7b8893] group-[.toast]:rounded-lg",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
