import { motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useEffect } from "react";

const NOTIFICATION_TTL = 2000;

const Notification = ({ id, removeNotif, text }:any) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif();
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <motion.div
      layout
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -25, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className="p-4 w-80 flex items-start rounded-lg gap-2 text-sm font-medium shadow-lg text-black bg-white border-2 border-black border-dashed fixed z-50 top-4 right-4"
    >
      <FiAlertCircle className="text-3xl absolute -top-4 -left-4 p-2 rounded-full bg-white text-rose-500 shadow" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};

export default Notification;
