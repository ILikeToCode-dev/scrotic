// A simple whiteboard component for drawing.
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { WhiteboardPath, WhiteboardPoint, WhiteboardTool } from '../types';
import WhiteboardToolbar from './WhiteboardToolbar';

export interface WhiteboardHandle {
  save: () => void;
}

interface WhiteboardProps {
  paths: WhiteboardPath[];
  onNewPath: (path: WhiteboardPath) => void;
}

const Whiteboard = React.forwardRef<WhiteboardHandle, WhiteboardProps>(({ paths, onNewPath }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<WhiteboardPath | null>(null);

  // Toolbar state
  const [tool, setTool] = useState<WhiteboardTool>('pen');
  const [color, setColor] = useState<string>('#000000');
  const [size, setSize] = useState<number>(5);

  // Endless canvas state
  const [viewTransform, setViewTransform] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    save: () => {
        if (paths.length === 0) {
            return;
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let hasPoints = false;
        paths.forEach(path => {
          path.points.forEach(p => {
            hasPoints = true;
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          });
        });

        if (!hasPoints) return;

        const padding = 40;
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        const canvasWidth = contentWidth + padding * 2;
        const canvasHeight = contentHeight + padding * 2;

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvasWidth;
        offscreenCanvas.height = canvasHeight;
        const ctx = offscreenCanvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = '#fdfdfd';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.save();
        ctx.translate(-minX + padding, -minY + padding);
        
        paths.forEach(path => {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = path.color;
            ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over';
    
            if (path.points.length < 2) {
                const p = path.points[0];
                if (!p) return;
                ctx.beginPath();
                ctx.fillStyle = path.color;
                ctx.arc(p.x, p.y, (p.pressure * path.size) / 2, 0, 2 * Math.PI);
                ctx.fill();
                return;
            }
    
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
    
            for (let i = 1; i < path.points.length; i++) {
                const startPoint = path.points[i-1];
                const endPoint = path.points[i];
                
                ctx.lineWidth = ((startPoint.pressure + endPoint.pressure) / 2) * path.size;
    
                const midPoint = {
                    x: (startPoint.x + endPoint.x) / 2,
                    y: (startPoint.y + endPoint.y) / 2
                };
                ctx.quadraticCurveTo(startPoint.x, startPoint.y, midPoint.x, midPoint.y);
                ctx.lineTo(endPoint.x, endPoint.y);
            }
            ctx.stroke();
        });
        ctx.restore();

        const link = document.createElement('a');
        link.download = 'socratic-tutor-whiteboard.png';
        link.href = offscreenCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }));

  const getPointInWorld = (clientX: number, clientY: number): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const worldX = (screenX - viewTransform.offsetX) / viewTransform.scale;
    const worldY = (screenY - viewTransform.offsetY) / viewTransform.scale;
    return { x: worldX, y: worldY };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button === 1) {
      setIsPanning(true);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    
    if (e.button !== 0) return;

    const { x, y } = getPointInWorld(e.clientX, e.clientY);
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentPath({
      id: Date.now().toString(),
      color: color,
      tool: tool,
      size: size,
      points: [{ x, y, pressure }],
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPoint.current.x;
      const dy = e.clientY - lastPanPoint.current.y;
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      setViewTransform(prev => ({ ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }));
      return;
    }

    if (!isDrawing || !currentPath) return;

    const { x, y } = getPointInWorld(e.clientX, e.clientY);
    const pressure = e.pressure > 0 ? e.pressure : 0.5;

    const points = currentPath.points;
    const lastPointPressure = points.length > 0 ? points[points.length - 1].pressure : pressure;
    const smoothedPressure = lastPointPressure * 0.8 + pressure * 0.2;

    setCurrentPath(prev => prev ? ({ ...prev, points: [...prev.points, { x, y, pressure: smoothedPressure }] }) : null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isPanning) {
        setIsPanning(false);
        return;
    }
    if (isDrawing && currentPath && currentPath.points.length > 0) {
      onNewPath(currentPath);
    }
    setIsDrawing(false);
    setCurrentPath(null);
  };
  
  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if(isDrawing || isPanning) {
        handlePointerUp(e);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const { clientX, clientY, deltaY } = e;
        const zoomFactor = 1.1;
        const newScale = deltaY < 0 ? viewTransform.scale * zoomFactor : viewTransform.scale / zoomFactor;
        const clampedScale = Math.max(0.1, Math.min(10, newScale));

        const rect = canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const newOffsetX = mouseX - (mouseX - viewTransform.offsetX) * (clampedScale / viewTransform.scale);
        const newOffsetY = mouseY - (mouseY - viewTransform.offsetY) * (clampedScale / viewTransform.scale);
        
        setViewTransform({ scale: clampedScale, offsetX: newOffsetX, offsetY: newOffsetY });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [viewTransform]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    if(canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(viewTransform.offsetX, viewTransform.offsetY);
    ctx.scale(viewTransform.scale, viewTransform.scale);

    const allPaths = currentPath ? [...paths, currentPath] : paths;

    allPaths.forEach(path => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = path.color;
        ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over';

        if (path.points.length < 2) {
            const p = path.points[0];
            if (!p) return;
            ctx.beginPath();
            ctx.fillStyle = path.color;
            ctx.arc(p.x, p.y, (p.pressure * path.size) / 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);

        for (let i = 1; i < path.points.length; i++) {
            const startPoint = path.points[i-1];
            const endPoint = path.points[i];
            
            ctx.lineWidth = ((startPoint.pressure + endPoint.pressure) / 2) * path.size;

            const midPoint = {
                x: (startPoint.x + endPoint.x) / 2,
                y: (startPoint.y + endPoint.y) / 2
            };
            ctx.quadraticCurveTo(startPoint.x, startPoint.y, midPoint.x, midPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
        }
        ctx.stroke();
    });
     ctx.restore();
  }, [paths, currentPath, viewTransform]);

  return (
    <div className="relative w-full h-full bg-white border rounded-lg shadow-sm overflow-hidden touch-none dotted-background">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full cursor-crosshair"
      />
      <WhiteboardToolbar 
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
      />
    </div>
  );
});

export default Whiteboard;