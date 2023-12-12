import { useState } from "react";
import CandidateModal from "./CandidateModal";
import { useIsMounted } from "@/hooks/useIsMounted";
import { FiAward } from "react-icons/fi";

const Table = ({
  electionInfo,
  setNotification,
  isConnected,
  refreshData,
}: any) => {
  const mounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<any>([]);
  const [selectedContractAddress, setSelectedContractAddress] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(0);

  const handleRowClick = (
    candidates: any,
    contractAddress: any,
    duration: any
  ) => {
    if (!isConnected) {
      setNotification(true);
      return;
    }
    setSelectedCandidates(candidates);
    setSelectedContractAddress(contractAddress);
    setSelectedDuration(+duration);
    setIsOpen(true);
  };

  const formatCountdown = (timestamp: any) => {
    const targetDate: any = new Date(timestamp);
    const now: any = Date.now();

    // Calculate the time difference in seconds
    let timeDiff = Math.floor((targetDate - now) / 1000);

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeDiff / (24 * 3600));
    timeDiff -= days * 24 * 3600;
    const hours = Math.floor(timeDiff / 3600);
    timeDiff -= hours * 3600;
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  // const convertUnixToYMD = (timestamp: any) => {
  //   const date = new Date(timestamp);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  //   const day = String(date.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl border-2 border-dashed border-black mx-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-[2px] border-black border-dashed text-slate-400 text-sm uppercase">
            <th className="pl-4 w-5"></th>
            <th className="text-start p-4 w-[40%] font-medium">Election</th>
            <th className="text-start p-4 font-medium">Candidates</th>
            <th className="text-start p-4 font-medium">Winner</th>
            <th className="text-center p-4 font-medium">Status</th>
          </tr>
        </thead>

        {electionInfo && (
          <tbody>
            {electionInfo?.map((item: any, i: any) => {
              const timestamp = selectedDuration * 1000;
              const now = Date.now();
              const countdown = formatCountdown(timestamp);


              const winnerIndices: any = [];
              let maxVotes = 0;
              item.candidates.forEach((candidate: any, currentIndex: any) => {
                if (candidate.votes > maxVotes) {
                  maxVotes = candidate.votes;
                  winnerIndices.length = 0;
                  winnerIndices.push(currentIndex);
                } else if (candidate.votes === maxVotes) {
                  winnerIndices.push(currentIndex);
                }
              }); 

              const selectedWinnerIndices: any = [];
              let selectedMaxVotes = 0;
              selectedCandidates.forEach((candidate: any, currentIndex: any) => {
                if (candidate.votes > selectedMaxVotes) {
                  selectedMaxVotes = candidate.votes;
                  selectedWinnerIndices.length = 0;
                  selectedWinnerIndices.push(currentIndex);
                } else if (candidate.votes === selectedMaxVotes) {
                  selectedWinnerIndices.push(currentIndex);
                }
              }); 


              return (
                <>
                  <tr
                    key={i}
                    className="text-black text-sm cursor-pointer hover:bg-slate-100 hover:text-slate-800  transition-all duration-100"
                    onClick={() =>
                      handleRowClick(
                        item.candidates,
                        item.contractAddress,
                        item.duration
                      )
                    }
                  >
                    <td className="pl-4 w-5"></td>
                    <td className="text-start p-4 w-[40%] font-medium">
                      {item.name}
                    </td>
                    <td className="text-start p-4 font-medium">
                      {item.totalCandidates}
                    </td>
                    {winnerIndices.length === 1 ? (
                      <td className="text-start p-4 font-medium flex ">
                        <span className="flex items-center gap-1 bg-amber-200 text-indigo-800 px-2 py-1 rounded">
                          <FiAward />
                          {item.candidates[winnerIndices[0]].name}
                        </span>
                      </td>
                    ) : (
                      <td className="text-start p-4 font-medium flex ">
                        <span className="flex items-center gap-1 bg-slate-200 text-slate-800 px-2 py-1 rounded">
                          Draw
                        </span>
                      </td>
                    )}
                    <td className="text-center p-4 font-medium">
                      {now < item.duration * 1000 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-200 text-green-800">
                          ongoing
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-200 text-purple-800">
                          completed
                        </span>
                      )}
                    </td>
                  </tr>
                  <CandidateModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    candidates={selectedCandidates}
                    contractAddress={selectedContractAddress}
                    formattedDate={timestamp}
                    countdown={countdown}
                    winner={now > timestamp && selectedWinnerIndices.length === 1 ? selectedCandidates[selectedWinnerIndices[0]]?.name : now > timestamp && selectedWinnerIndices.length != 1 ? "Draw" : "Ongoing"}
                  />
                </>
              );
            })}
          </tbody>
        )}
      </table>
      {!electionInfo && (
        <tbody className="w-full h-[30vh] flex justify-center items-center">
            <h2 className="text-slate-300 text-center text-3xl">No Votes Yet ☹️</h2>
        </tbody>
      )}
    </div>
  );
};
export default Table;
