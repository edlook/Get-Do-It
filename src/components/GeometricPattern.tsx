export default function GeometricPattern({ className = '', color = 'hsl(0 0% 80% / 0.3)' }: { className?: string; color?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1200 600"
    >
      {/* Network lines */}
      <line x1="100" y1="50" x2="350" y2="150" stroke={color} strokeWidth="0.8" />
      <line x1="350" y1="150" x2="600" y2="80" stroke={color} strokeWidth="0.8" />
      <line x1="600" y1="80" x2="900" y2="200" stroke={color} strokeWidth="0.8" />
      <line x1="900" y1="200" x2="1100" y2="100" stroke={color} strokeWidth="0.8" />
      <line x1="200" y1="300" x2="500" y2="250" stroke={color} strokeWidth="0.8" />
      <line x1="500" y1="250" x2="750" y2="350" stroke={color} strokeWidth="0.8" />
      <line x1="750" y1="350" x2="1050" y2="300" stroke={color} strokeWidth="0.8" />
      <line x1="100" y1="50" x2="200" y2="300" stroke={color} strokeWidth="0.8" />
      <line x1="350" y1="150" x2="500" y2="250" stroke={color} strokeWidth="0.8" />
      <line x1="600" y1="80" x2="750" y2="350" stroke={color} strokeWidth="0.8" />
      <line x1="900" y1="200" x2="1050" y2="300" stroke={color} strokeWidth="0.8" />
      <line x1="50" y1="400" x2="200" y2="300" stroke={color} strokeWidth="0.8" />
      <line x1="500" y1="250" x2="400" y2="500" stroke={color} strokeWidth="0.8" />
      <line x1="750" y1="350" x2="850" y2="500" stroke={color} strokeWidth="0.8" />
      <line x1="1050" y1="300" x2="1150" y2="450" stroke={color} strokeWidth="0.8" />
      <line x1="1100" y1="100" x2="1150" y2="450" stroke={color} strokeWidth="0.8" />
      
      {/* Dots at intersections */}
      {[
        [100, 50], [350, 150], [600, 80], [900, 200], [1100, 100],
        [200, 300], [500, 250], [750, 350], [1050, 300],
        [50, 400], [400, 500], [850, 500], [1150, 450],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} />
      ))}
    </svg>
  );
}
