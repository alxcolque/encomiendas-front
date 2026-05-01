import { useEffect, useRef } from 'react';

/**
 * Senior Hook to handle "Back to Close" behavior for modals and overlays.
 * It uses a dummy history state to intercept the browser's back button.
 * 
 * @param isOpen Current open state
 * @param onClose Function to call when the user hits back
 */
export const useBackToClose = (isOpen: boolean, onClose: () => void) => {
    const isManuallyClosing = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            // If we were open and now we are closed, and it wasn't via the back button,
            // we need to remove our dummy state from the history.
            if (isManuallyClosing.current) {
                isManuallyClosing.current = false;
                if (window.history.state?.isBackToClose) {
                    window.history.back();
                }
            }
            return;
        }

        // Push a dummy state to history to intercept the back button
        window.history.pushState({ isBackToClose: true }, "");

        const handlePopState = (event: PopStateEvent) => {
            // If the back button was pressed, we close the modal
            // We check if the state we are entering has isBackToClose (should be false/undefined now)
            onClose();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            isManuallyClosing.current = true;
        };
    }, [isOpen, onClose]);
};
