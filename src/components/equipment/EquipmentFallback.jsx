// src/components/equipment/EquipmentFallback.tsx
// Static image fallback used when the 3D canvas cannot be rendered or no
// model/image is available.
import { useEffect, useState } from 'react';
export default function EquipmentFallback({ body, imageUrl }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (imageUrl)
            return;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const accent = body?.accent ?? '#42BFFF';
            const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
            grad.addColorStop(0, accent);
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);
        }
        setSrc(canvas.toDataURL('image/png'));
    }, [body, imageUrl]);
    if (imageUrl) {
        return (<div className="eq-fallback">
        <img src={imageUrl} alt={body?.name.en ?? 'equipment'} className="eq-fallback__img"/>
      </div>);
    }
    return (<div className="eq-fallback">
      {src && <img src={src} alt={body?.name.en ?? 'equipment'} className="eq-fallback__img"/>}
      <p className="eq-fallback__label">{body?.name.en ?? 'Equipment'}</p>
    </div>);
}
