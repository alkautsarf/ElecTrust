import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { castVote } from "@/scripts/contract";

const BarPoll = ({
  candidates,
  isOpen,
  address,
  contractAddress,
  setNotification,
  winner,
}: any) => {
  const [votes, setVotes] = useState<any>([
    // {
    //   title: "Tabs",
    //   votes: 1,
    //   // NOTE: Color assumes a tailwind CSS class.
    //   // One off colors could be added using something like:
    //   // bg-[#6366F1]
    //   color: "bg-indigo-500",
    // },
    // {
    //   title: "Spaces",
    //   votes: 2,
    //   color: "bg-fuchsia-500",
    // },
    // {
    //   title: "Who cares bro?",
    //   votes: 3,
    //   color: "bg-violet-500",
    // },
  ]);

  useEffect(() => {
    const colors = ["bg-indigo-500", "bg-fuchsia-500", "bg-violet-500"];
    const updatedVotes = candidates.map((el: any, index: any) => ({
      title: el.name,
      votes: el.votes,
      color: colors[index % colors.length],
    }));
    isOpen ? setVotes(updatedVotes) : setVotes([]);
  }, [candidates, isOpen]);

  return (
    <section className=" px-4 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 md:grid-cols-[1fr_400px] md:gap-12">
        <Options
          votes={votes}
          address={address}
          contractAddress={contractAddress}
          setNotification={setNotification}
          winner={winner}
        />
        <Bars votes={votes} winner={winner} />
      </div>
    </section>
  );
};

const Options = ({
  votes,
  address,
  contractAddress,
  setNotification,
  winner,
}: any) => {
  const totalVotes = votes.reduce((acc: any, cv: any) => (acc += cv.votes), 0);

  return (
    <div className="col-span-1 py-12">
      <h3 className="mb-6 text-3xl font-semibold text-slate-50">
        {winner !== "Draw" &&
          winner !== "Ongoing" &&
          `${winner} is the winner 👑`}
        {winner === "Draw" && `${winner} 🤝`}
        {winner === "Ongoing" && "Cast Your Vote 🚀"}
      </h3>
      <div className="mb-6 space-y-2">
        {winner === "Ongoing" &&
          votes.map((vote: any, index: any) => {
            return (
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={async () => {
                  const vote: any = await castVote(
                    address,
                    contractAddress,
                    index + 1
                  );
                  if (vote?.shortMessage) setNotification(true);
                }}
                key={vote.title}
                className={`w-full rounded-md ${vote.color} py-2 font-medium text-white`}
              >
                {vote.title}
              </motion.button>
            );
          })}
        {winner !== "Draw" &&
          winner !== "Ongoing" && (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            key={winner}
            className={`w-full rounded-md bg-amber-200 py-2 font-medium text-amber-800`}
          >
            {winner}
          </motion.button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="mb-2 italic text-slate-50">{totalVotes} votes</span>
      </div>
    </div>
  );
};

const Bars = ({ votes, winner }: any) => {
  const totalVotes = votes.reduce((acc: any, cv: any) => (acc += cv.votes), 0);

  return (
    <div
      className="col-span-1 grid min-h-[200px] gap-2"
      style={{
        gridTemplateColumns: `repeat(${votes.length}, minmax(0, 1fr))`,
      }}
    >
      {votes.map((vote: any) => {
        const height = vote.votes
          ? ((vote.votes / totalVotes) * 100).toFixed(2)
          : 0;
        return (
          <div key={vote.title} className="col-span-1">
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800">
              <motion.span
                animate={{ height: `${height}%` }}
                className={`relative z-0 w-full ${winner === vote.title ? `bg-amber-200` : vote.color}`}
                transition={{ type: "spring" }}
              />
              <span className="absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm text-slate-50">
                <b className={`${winner === vote.title ? `text-amber-800` : `text-slate-50`}`}>{vote.title}</b>
                <br></br>
                <span className={`text-xs ${winner === vote.title ? `text-amber-800` : `text-slate-200`}`}>
                  {vote.votes} votes
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarPoll;
