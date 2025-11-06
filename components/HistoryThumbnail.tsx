import React, { useRef, useEffect } from 'react';
import { WhiteboardPath } from '../types';

interface WhiteboardThumbnailProps {
  paths: WhiteboardPath[];
  width: number;
  height: number;
}

const WhiteboardThumbnail: React.FC<WhiteboardThumbnailProps> = ({ paths, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas for empty states
    if (paths.length === 0) {
        ctx.clearRect(0, 0, width, height);
        return;
    }

    // Calculate bounding box of all points
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
    
    // If there are no points, clear and return
    if (!hasPoints) {
        ctx.clearRect(0, 0, width, height);
        return;
    }

    const contentWidth = Math.max(1, maxX - minX); // Avoid division by zero
    const contentHeight = Math.max(1, maxY - minY);
    
    const padding = 10;
    const scaleX = (width - padding * 2) / contentWidth;
    const scaleY = (height - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;

    const offsetX = (width - scaledWidth) / 2 - minX * scale;
    const offsetY = (height - scaledHeight) / 2 - minY * scale;

    // Drawing logic
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    paths.forEach(path => {
        if (path.points.length === 0) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = path.color;
        // Eraser doesn't make sense on a non-persistent background, so draw everything normally.
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = path.size; 

        if (path.points.length < 2) {
            const p = path.points[0];
            ctx.beginPath();
            ctx.fillStyle = path.color;
            ctx.arc(p.x, p.y, path.size / 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);

        for (let i = 1; i < path.points.length; i++) {
            const startPoint = path.points[i-1];
            const endPoint = path.points[i];
            
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

  }, [paths, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-gray-50 border rounded-sm dotted-background" />;
};

export default WhiteboardThumbnail;