import React from "react";
import { createPortal } from 'react-dom'

export function Modal({ isOpen, onClose, children }: {isOpen: boolean; onClose: () => void; children: React.ReactNode}) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-xl p-6 w-96"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.getElementById('root')!
    )


}