import React, { useEffect, useState } from "react";
import { useAnimate, motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";

const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });

const SpinningBoxText = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-5xl font-semibold text-black md:flex-row md:gap-4" >
      <div className="text-7xl">Redefining</div>{" "}
      <Box
        front="Trust"
        bottom="Transparency"
        back="Democracy"
        top="Security"
      />
    </div>
  );
};

const Box = ({ front, bottom, back, top }: any) => {
  return (
    <motion.span
      className="relative h-20 w-96 font-black "
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center -40px",
      }}
      initial={{ rotateX: "0deg" }}
      animate={{
        rotateX: [
          "0deg",
          "90deg",
          "90deg",
          "180deg",
          "180deg",
          "270deg",
          "270deg",
          "360deg",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 10,
        ease: "backInOut",
        times: [0, 0.2, 0.25, 0.45, 0.5, 0.7, 0.75, 1],
      }}
    >
      {/* FRONT */}
      <span className="absolute flex h-full w-full items-center justify-center border-2 border-indigo-400 bg-indigo-600 text-white">
        {front}
      </span>

      {/* BOTTOM */}
      <span
        style={{ transform: "translateY(5rem) rotateX(-90deg)" }}
        className="absolute flex h-full w-full origin-top items-center justify-center border-2 border-indigo-400 bg-indigo-600 text-white"
      >
        {bottom}
      </span>

      {/* TOP */}
      <span
        style={{ transform: "translateY(-5rem) rotateX(90deg)" }}
        className="absolute flex h-full w-full origin-bottom items-center justify-center border-2 border-indigo-400 bg-indigo-600 text-white"
      >
        {top}
      </span>

      {/* BACK */}
      <span
        style={{
          transform: "translateZ(-5rem) rotateZ(-180deg) rotateY(180deg)",
        }}
        className="absolute flex h-full w-full origin-center items-center justify-center border-2 border-indigo-400 bg-indigo-600 text-white"
      >
        {back}
      </span>
    </motion.span>
  );
};

const Hero = () => {

  const router = useRouter();
  const [scope, animate] = useAnimate();

  const [size, setSize] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    generateGridCount();
    window.addEventListener("resize", generateGridCount);
    return () => window.removeEventListener("resize", generateGridCount);
  }, []);

  useEffect(() => {
    console.log(document.body.clientHeight);
    
  }, [size]);
  const generateGridCount = () => {
    const columns = Math.floor(document.body.clientWidth / 75);
    // const rows = Math.floor(document.body.clientHeight / 75);
    const rows = Math.floor(884 / 75);

    setSize({
      columns,
      rows,
    });
  };

  const handleMouseLeave = (e: any) => {
    // @ts-ignore
    const id = `#${e.target.id}`;
    animate(id, { background: "rgba(129, 140, 248, 0)" }, { duration: 1.5 });
  };

  const handleMouseEnter = (e: any) => {
    // @ts-ignore
    const id = `#${e.target.id}`;
    animate(id, { background: "rgba(129, 140, 248, 1)" }, { duration: 0.15 });
  };

  return (
    <>
      <div
        ref={scope}
        className="grid h-screen w-full grid-cols-[repeat(auto-fit,_minmax(75px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(75px,_1fr))]"
      >
        {[...Array(size.rows * size.columns)].map((_, i) => (
          <div
            key={i}
            id={`square-${i}`}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="h-full w-full border-[1px] border-neutral-900"
          />
        ))}
      </div>
      <div className="absolute inset-[385px] ">
        <div className="pointer-events-none flex flex-col items-center justify-center p-8">
          <div
            className={`${poppins600.className} text-center text-7xl font-black text-neutral-950 sm:text-8xl md:text-8xl mb-6`}
          >
            <SpinningBoxText />
          </div>
          <button
            onClick={() => {
              router.push("/app");
            }}
            className={`${poppins600.className} mt-4 pointer-events-auto rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none`}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;
