"use client";

import { useEffect } from "react";

export function ImageSecurityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isProtectedImageTarget = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return false;
      }

      return (
        target.tagName === "IMG" ||
        Boolean(target.closest("[data-secure-image]")) ||
        Boolean(target.closest("article img"))
      );
    };

    const preventRightClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button === 2 && isProtectedImageTarget(event)) {
        mouseEvent.preventDefault();
      }
    };

    const preventDrag = (event: Event) => {
      if (isProtectedImageTarget(event)) {
        const dragEvent = event as DragEvent;
        dragEvent.preventDefault();
      }
    };

    const preventContextMenu = (event: Event) => {
      if (isProtectedImageTarget(event)) {
        event.preventDefault();
      }
    };

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
