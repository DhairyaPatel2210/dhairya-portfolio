import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Glitch effect interval
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Reality Not Found</title>
        <meta
          name="description"
          content="You've reached the void. Reality.js not found."
        />
      </Helmet>
      <div
        className="min-h-screen w-full bg-black text-white overflow-hidden relative"
        style={{
          perspective: "1000px",
        }}
      >
        {/* Matrix-like background */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500 text-xs animate-matrix-fall whitespace-nowrap"
              style={{
                left: `${i * 10}%`,
                animationDelay: `${i * 0.3}s`,
                top: "-100%",
              }}
            >
              {Array.from({ length: 20 })
                .map(() =>
                  String.fromCharCode(Math.floor(Math.random() * 65) + 12354)
                )
                .join("")}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div
          className="relative min-h-screen flex flex-col items-center justify-center"
          style={{
            transform: `rotateX(${mousePosition.y * 0.1}deg) rotateY(${
              mousePosition.x * 0.1
            }deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div
            className={`space-y-8 text-center ${
              isGlitching ? "animate-glitch" : ""
            }`}
          >
            <h1 className="text-[150px] font-bold leading-none tracking-tighter relative">
              <span className="relative inline-block">
                <span
                  className={`absolute -inset-2 bg-red-500 opacity-30 blur-lg ${
                    isGlitching ? "animate-pulse" : ""
                  }`}
                ></span>
                404
              </span>
            </h1>
            <div className="space-y-4">
              <p className="text-2xl font-mono">Reality.js not found</p>
              <p className="text-sm text-gray-400 font-mono">
                [Error: Universe failed to load this dimension]
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/"
                className="inline-block px-6 py-3 font-mono text-sm border border-white/20 rounded-lg 
                           hover:bg-white/10 hover:border-white/40 hover:text-teal-400 
                           transition-all duration-300 relative group"
              >
                <span className="relative z-10">RETURN TO REALITY</span>
                <div
                  className="absolute inset-0 bg-white/5 rounded-lg 
                              group-hover:animate-pulse"
                ></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Glitch overlay */}
        {isGlitching && (
          <div className="absolute inset-0 bg-white/5 animate-flicker pointer-events-none"></div>
        )}
      </div>
    </>
  );
};

// Add keyframes for the animations
const style = document.createElement("style");
style.textContent = `
  @keyframes matrix-fall {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  @keyframes flicker {
    0% { opacity: 0.3; }
    50% { opacity: 0; }
    100% { opacity: 0.3; }
  }

  .animate-matrix-fall {
    animation: matrix-fall 10s linear infinite;
  }

  .animate-glitch {
    animation: glitch 0.2s ease-in-out infinite;
  }

  .animate-flicker {
    animation: flicker 0.2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default NotFound;
