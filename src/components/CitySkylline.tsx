import skylineImg from '@/assets/city-skyline.png';

export default function CitySkyline({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <img
        src={skylineImg}
        alt=""
        className="w-full h-full object-cover object-top opacity-30"
      />
    </div>
  );
}
