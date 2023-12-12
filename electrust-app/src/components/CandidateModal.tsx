import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import BarPoll from "./BarPoll";
import Countdown from "./Countdown";
import { useEffect, useState } from "react";
import Notification from "@/components/Notification";

declare global {
  interface Window {
    ethereum: any;
  }
}

const CandidateModal = ({
  isOpen,
  setIsOpen,
  candidates,
  contractAddress,
  formattedDate,
  countdown,
  winner
}: any) => {
  const { address } = useAccount();
  const [notification, setNotification] = useState<any>(null);

  const removeNotif = () => {
    setNotification(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Countdown formattedDate={formattedDate} countdown={countdown}/>
            <BarPoll winner={winner} candidates={candidates} isOpen={isOpen} address={address} contractAddress={contractAddress} setNotification={setNotification}/>
          </motion.div>
          <AnimatePresence>
          {notification && <Notification removeNotif={removeNotif} key={1} text={formattedDate < Date.now() ? "Vote Ends 🙁" : "You Can Only Cast Vote Once 🥲"} />}
        </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CandidateModal;

