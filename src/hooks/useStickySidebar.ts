import { useEffect, useRef, useState } from 'react';

const TOP_OFFSET = 112;
const BOTTOM_PADDING = 40;

export function useStickySidebar(contentDep: unknown) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [stickyOffset, setStickyOffset] = useState(TOP_OFFSET);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (sidebarHeight > viewportHeight - TOP_OFFSET) {
        const bottomOffset = viewportHeight - sidebarHeight - BOTTOM_PADDING;

        if (isScrollingDown) {
          setStickyOffset((prev) => Math.max(bottomOffset, prev - (currentScrollY - lastScrollY.current)));
        } else {
          setStickyOffset((prev) => Math.min(TOP_OFFSET, prev + (lastScrollY.current - currentScrollY)));
        }
      } else {
        setStickyOffset(TOP_OFFSET);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentDep]);

  return { sidebarRef, stickyOffset };
}
