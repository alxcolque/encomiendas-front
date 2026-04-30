import { useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore';

/**
 * Senior History Back Handler
 * 
 * This component manages the browser history to intercept the "Back" gesture/button.
 * When a modal or overlay is open (tracked in uiStore), it pushes a dummy entry to history.
 * If the user hits back, it triggers the removal of the blocker instead of navigating away.
 */
export const HistoryBackHandler = () => {
  const { isBackBlocked, removeBlocker, blockers } = useUIStore();
  const historyPushed = useRef(false);

  useEffect(() => {
    if (isBackBlocked && !historyPushed.current) {
      // User just opened something, push a state to intercept the back button
      window.history.pushState({ isOverlay: true }, "");
      historyPushed.current = true;
    } else if (!isBackBlocked && historyPushed.current) {
      // Everything closed manually, we should clear the dummy state if we're still on it
      // But we can't easily "remove" a state without going back or forward.
      // Usually, if we are here, it means the user closed the modal via UI.
      // We don't want the dummy state to linger, so we could do history.back(), 
      // but that's risky. A better way is to handle it in popstate.
      historyPushed.current = false;
    }
  }, [isBackBlocked]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isBackBlocked) {
        // User hit back button while an overlay was open
        // Close the last blocker
        const lastBlocker = Array.from(blockers).pop();
        if (lastBlocker) {
          removeBlocker(lastBlocker);
        }
        historyPushed.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBackBlocked, blockers, removeBlocker]);

  return null;
};
