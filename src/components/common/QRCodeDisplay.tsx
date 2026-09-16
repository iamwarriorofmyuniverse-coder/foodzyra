import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  showCode?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 140,
  className = '',
  showCode = true
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => {
        console.error('Failed to generate QR Code:', err);
      });
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR code for ${value}`}
          style={{ width: `${size}px`, height: `${size}px` }}
          className="rounded-lg object-contain"
        />
      ) : (
        <div
          style={{ width: `${size}px`, height: `${size}px` }}
          className="bg-slate-100 rounded-lg animate-pulse flex items-center justify-center text-xs text-slate-400"
        >
          Loading QR...
        </div>
      )}
      {showCode && (
        <div className="mt-2 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pickup Code</span>
          <span className="font-mono font-black text-sm sm:text-base text-forest-900 tracking-wider">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
