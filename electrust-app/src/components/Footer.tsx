import React, { useState } from "react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { TypeAnimation } from "react-type-animation";

const poppins500 = Poppins({ weight: "500", subsets: ["latin"] });

const Footer = () => {
  return (
    <div
      className={`${poppins500.className} absolute -translate-y-16 z-0 w-full h-[25vh] bg-neutral-200 flex flex-col justify-center items-center text-3xl `}
    >
      <div className="flex justify-center items-center mt-10">
        Crafted by&nbsp;
        <div className="border border-white p-6 bg-neutral-900 rounded-3xl">
          <TypeAnimation
            sequence={["0x.elpabl0", 1000, "Alkautsar.F", 1000]}
            wrapper="span"
            speed={3}
            deletionSpeed={3}
            style={{ fontSize: 30, color: "white" }}
            repeat={Infinity}
          />
        </div>
      </div>
      <div className="w-full absolute bottom-0">
        {/* <LogoHero/> */}
      </div>
    </div>
  );
};

export default Footer;


