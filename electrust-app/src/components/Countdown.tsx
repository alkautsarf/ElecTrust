import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Countdown = ({ formattedDate, countdown }: any) => {
  const intervalRef = useRef<any>(null);

  const [remaining, setRemaining] = useState(countdown);

  useEffect(() => {    
    if(remaining.days < 0) {
      clearInterval(intervalRef.current || undefined);
      setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = () => {
    const end = new Date(formattedDate);
    const now = new Date();
    const distance = +end - +now;

    if (distance <= 0) {
      clearInterval(intervalRef.current || undefined);
      setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const days = Math.floor(distance / DAY);
      const hours = Math.floor((distance % DAY) / HOUR);
      const minutes = Math.floor((distance % HOUR) / MINUTE);
      const seconds = Math.floor((distance % MINUTE) / SECOND);

      setRemaining({
        days,
        hours,
        minutes,
        seconds,
      });
    }
  };

  return (
    <div className="sticky left-0 right-0 top-0 z-50 w-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg px-2 py-0.5 text-white">
      <div className="mx-auto flex w-fit max-w-5xl flex-wrap items-center justify-center gap-x-4 text-xs md:text-sm">
        <CountdownItem num={remaining.days} text="days" />
        <CountdownItem num={remaining.hours} text="hours" />
        <CountdownItem num={remaining.minutes} text="minutes" />
        <CountdownItem num={remaining.seconds} text="seconds" />
      </div>
    </div>
  );
};

const CountdownItem = ({ num, text }: any) => {
  return (
    <div className="flex w-fit items-center justify-center gap-1.5 py-2">
      <div className="relative w-full overflow-hidden text-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={num}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ ease: "backIn", duration: 0.75 }}
            className="block font-mono text-sm font-semibold md:text-base"
          >
            {num}
          </motion.span>
        </AnimatePresence>
      </div>
      <span>{text}</span>
    </div>
  );
};

export default Countdown;
