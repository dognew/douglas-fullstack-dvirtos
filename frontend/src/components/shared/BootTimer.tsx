import { useEffect, useState } from 'react';

interface BootTimerProps {
  /** Countdown duration in seconds */
  seconds: number;
  /** Callback function executed when the timer reaches zero */
  onComplete: () => void;
  /** Optional CSS class for custom animations (e.g., Tailwind animate-pulse) */
  animationClass?: string;
  /** Custom label displayed before the countdown number */
  message?: string;
}

export default function BootTimer({ 
  seconds, 
  onComplete, 
  animationClass = '', 
  message = 'Automatic boot in' 
}: BootTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className={`flex items-center gap-2 font-mono ${animationClass}`}>
      <span>{message}</span>
      <span className="min-w-[20px] text-center bg-white text-black px-1 font-bold">
        {timeLeft}
      </span>
      <span>seconds...</span>
    </div>
  );
}