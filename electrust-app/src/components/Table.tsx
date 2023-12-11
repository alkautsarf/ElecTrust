import { useState } from "react";
import CandidateModal from "./CandidateModal";
import { useIsMounted } from "@/hooks/useIsMounted";

const Table = ({ electionInfo, setNotification, isConnected, refreshData }: any) => {
  const mounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedContractAddress, setSelectedContractAddress] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(0);

  const handleRowClick = (candidates: any, contractAddress: any, duration:any) => {
    if (!isConnected) {
      setNotification(true);
      return;
    }
    setSelectedCandidates(candidates);
    setSelectedContractAddress(contractAddress);
    setSelectedDuration(+duration);
    setIsOpen(true);
  };

  const formatCountdown = (timestamp:any) => {
    const targetDate:any = new Date(timestamp);
    const now:any = Date.now();
  
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

  const convertUnixToYMD = (timestamp:any) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full bg-white shadow-lg overflow-x-scroll rounded-2xl border-2 border-dashed border-black mx-auto">
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

        <tbody>
          {electionInfo?.map((item: any, i: any) => {
            const timestamp = selectedDuration * 1000;
            const now = Date.now();
            const countdown = formatCountdown(timestamp)
            return (
              <>
                <tr
                  key={i}
                  className="text-black text-sm cursor-pointer"
                  onClick={() =>
                    handleRowClick(item.candidates, item.contractAddress, item.duration)
                  }
                >
                  <td className="pl-4 w-5"></td>
                  <td className="text-start p-4 w-[40%] font-medium">
                    {item.name}
                  </td>
                  <td className="text-start p-4 font-medium">
                    {item.totalCandidates}
                  </td>
                  <td className="text-start p-4 font-medium">Me</td>
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
                  refreshData={refreshData}
                  formattedDate={timestamp}
                  countdown={countdown}
                />
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
