import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3366FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path>
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
            values="M0,160L80,170C160,180,320,200,480,192C640,184,800,144,960,133.3C1120,123,1280,149,1360,162.7L1440,176L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
            M0,120L80,140C160,160,320,200,480,192C640,184,800,144,960,133.3C1120,123,1280,149,1360,162.7L1440,176L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
            M0,160L80,170C160,180,320,200,480,192C640,184,800,144,960,133.3C1120,123,1280,149,1360,162.7L1440,176L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </path>
        <rect width="1440" height="320" fill="url(#bg-gradient)" />
      </svg>
    </div>
  );
}
