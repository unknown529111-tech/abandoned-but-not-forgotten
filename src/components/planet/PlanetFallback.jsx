// src/components/planet/PlanetFallback.tsx
// Static image fallback used when the 3D canvas cannot be rendered.
import { useEffect, useState } from 'react';
export default function PlanetFallback({ body }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
            grad.addColorStop(0, body.accent);
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);
        }
        setSrc(canvas.toDataURL('image/png'));
    }, [body.accent]);
    return (<div className="planet-fallback">
      {src && <img src={src} alt={body.name.en} className="planet-fallback__img"/>}
      <p className="planet-fallback__label">{body.name.en}</p>
    </div>);
}
