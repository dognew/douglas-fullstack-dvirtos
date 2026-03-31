import { useState, useCallback, useEffect } from 'react';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'none';

/**
 * System Hook: useWindowInteractions
 * Responsibility: Unified engine for window movement, resizing, and maximization.
 */
export const useWindowInteractions = (initialX: number, initialY: number, initialW: number, initialH: number) => {
    const [rect, setRect] = useState({ x: initialX, y: initialY, w: initialW, h: initialH });
    const [isMaximized, setIsMaximized] = useState(false);
    const [prevRect, setPrevRect] = useState({ x: initialX, y: initialY, w: initialW, h: initialH });
    
    const [isDragging, setIsDragging] = useState(false);
    const [resizeDir, setResizeDir] = useState<ResizeDirection>('none');
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const toggleMaximize = useCallback(() => {
        if (!isMaximized) {
            setPrevRect(rect);
            setRect({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight });
        } else {
            setRect(prevRect);
        }
        setIsMaximized(!isMaximized);
    }, [isMaximized, rect, prevRect]);

    const startDrag = useCallback((e: React.MouseEvent) => {
        if (isMaximized || (e.target as HTMLElement).closest('button')) return;
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.x, y: e.clientY - rect.y });
    }, [rect.x, rect.y, isMaximized]);

    const startResize = useCallback((e: React.MouseEvent, dir: ResizeDirection) => {
        if (isMaximized) return;
        e.preventDefault();
        setResizeDir(dir);
        setOffset({ x: e.clientX, y: e.clientY });
    }, [isMaximized]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setRect(prev => ({ ...prev, x: e.clientX - offset.x, y: e.clientY - offset.y }));
            } else if (resizeDir !== 'none') {
                const deltaX = e.clientX - offset.x;
                const deltaY = e.clientY - offset.y;

                setRect(prev => {
                    const newRect = { ...prev };
                    if (resizeDir === 'e') newRect.w = Math.max(200, prev.w + deltaX);
                    if (resizeDir === 'w') {
                        const added = prev.x - e.clientX;
                        newRect.x = e.clientX;
                        newRect.w = Math.max(200, prev.w + added);
                    }
                    if (resizeDir === 's') newRect.h = Math.max(100, prev.h + deltaY);
                    if (resizeDir === 'n') {
                        const addedHeight = prev.y - e.clientY;
                        newRect.y = e.clientY;
                        newRect.h = Math.max(100, prev.h + addedHeight);
                    }
                    return newRect;
                });
                setOffset({ x: e.clientX, y: e.clientY });
            }
        };

        const stopInteraction = () => {
            setIsDragging(false);
            setResizeDir('none');
        };

        if (isDragging || resizeDir !== 'none') {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', stopInteraction);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', stopInteraction);
        };
    }, [isDragging, resizeDir, offset]);

    return { rect, startDrag, startResize, toggleMaximize, isDragging, isMaximized, isResizing: resizeDir !== 'none' };
};