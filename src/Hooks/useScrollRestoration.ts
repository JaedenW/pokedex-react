import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';

// Scroll positions by history entry, so Back returns to where you were
const positions = new Map<string, number>();

/**
 * Restores an inner scroll container when navigating back or forward, and
 * resets it to the top for new pages. The window itself never scrolls here.
 */
export function useScrollRestoration(ref: RefObject<HTMLElement | null>) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const restoring = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const onScroll = () => {
      if (restoring.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        positions.set(location.key, element.scrollTop)
      );
    };
    element.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      element.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [location.key, ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const target =
      navigationType === 'POP' ? (positions.get(location.key) ?? 0) : 0;
    element.scrollTop = target;
    if (!target) return;

    // the page may still be loading, so keep nudging until it is tall enough
    restoring.current = true;
    let frames = 0;
    let frame = 0;
    const settle = () => {
      element.scrollTop = target;
      if (Math.abs(element.scrollTop - target) < 2 || ++frames > 40) {
        restoring.current = false;
        return;
      }
      frame = requestAnimationFrame(settle);
    };
    frame = requestAnimationFrame(settle);
    return () => {
      cancelAnimationFrame(frame);
      restoring.current = false;
    };
  }, [location.key, navigationType, ref]);
}
