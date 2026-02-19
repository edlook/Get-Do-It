import skylineImg from '@/assets/city-skyline.png';

export default function CitySkyline({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      {/* Clip the right ~25% to remove the getdoit.io watermark */}
      <img
        src={skylineImg}
        alt=""
        className="h-full object-cover object-left opacity-30"
        style={{ width: '130%', maxWidth: 'none' }}
      />
    </div>
  );
}
