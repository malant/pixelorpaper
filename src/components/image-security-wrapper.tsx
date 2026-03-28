"use client";

import { useEffect } from "react";

export function ImageSecurityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Globally disable all context menus
    const preventContextMenu = (event: Event) => {
      event.preventDefault();
      (event as MouseEvent).stopPropagation();
      (event as MouseEvent).stopImmediatePropagation();
      return false;
    };

    // Block right mouse button globally
    const preventRightClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button === 2) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        mouseEvent.stopImmediatePropagation();
        return false;
      }
    };

    // Block image dragging
    const preventDrag = (event: Event) => {
      const dragEvent = event as DragEvent;
      dragEvent.preventDefault();
      dragEvent.stopPropagation();
      dragEvent.stopImmediatePropagation();
    };

    // Use capture phase (true) to intercept before handlers bubble up
    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("mousedown", preventRightClick, true);
    document.addEventListener("dragstart", preventDrag, true);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("mousedown", preventRightClick, true);
      document.removeEventListener("dragstart", preventDrag, true);
    };
  }, []);

  return <>{children}</>;
}
