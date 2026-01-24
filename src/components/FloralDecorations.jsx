function FloralDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Top Left Corner - Dahlia arrangement */}
      <div className="absolute -top-16 -left-16 w-80 h-80 opacity-70">
        <img
          src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{
            maskImage: 'radial-gradient(ellipse at top left, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top left, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Top Right Corner - Pink dahlias */}
      <div className="absolute -top-16 -right-16 w-80 h-80 opacity-70">
        <img
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{
            maskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Bottom Left - Roses */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{
            maskImage: 'radial-gradient(ellipse at bottom left, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at bottom left, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Bottom Right - Burgundy florals */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{
            maskImage: 'radial-gradient(ellipse at bottom right, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at bottom right, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Floating petals using CSS */}
      <div className="floating-petals">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="petal absolute w-4 h-6 rounded-full opacity-60"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
              background: ['#a82448', '#c9305a', '#d64070', '#722034', '#e8a0b0', '#8b2942', '#bf4060', '#9a1a3a'][i],
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default FloralDecorations
