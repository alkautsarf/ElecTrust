import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });


const Loader = () => {
  return (
    <div className=" h-screen w-full absolute grid place-content-center bg-black/40 backdrop-blur-sm px-4 py-24 z-50">
      <BarLoader />
    </div>
  );
};

const variants:any = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = () => {
  return (
    <>
    <div className="flex flex-col items-center">
      
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
    </motion.div>
    <h2 className={`${poppins600.className} text-xl text-white mt-4`}>Loading...</h2>
    </div>
    </>
  );
};

export default Loader;