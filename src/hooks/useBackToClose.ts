import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

/**
 * Senior Hook to link a component's open state to the global back button handler.
 * 
 * @param isOpen Current open state of the modal/overlay
 * @param id Unique ID for this overlay
 * @param onClose Function to call when back is pressed
 */
export const useBackToClose = (isOpen: boolean, id: string, onClose: () => void) => {
    const { addBlocker, removeBlocker, blockers } = useUIStore();

    useEffect(() => {
        if (isOpen) {
            addBlocker(id);
        } else {
            removeBlocker(id);
        }

        return () => {
            removeBlocker(id);
        };
    }, [isOpen, id, addBlocker, removeBlocker]);

    // Handle external close (popstate)
    useEffect(() => {
        // If this blocker was removed from the store but the local state is still open,
        // it means it was closed via the back button (popstate handler in HistoryBackHandler)
        if (isOpen && !blockers.has(id)) {
            onClose();
        }
    }, [blockers, id, isOpen, onClose]);
};
