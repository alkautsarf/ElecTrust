import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import { elecTrustV2ABI } from "@/generated";
import { useIsMounted } from "../hooks/useIsMounted";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import {
  createWalletClient,
  custom,
  parseEther,
  createPublicClient,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import SpringModal from "@/components/Modal";

declare global {
  interface Window {
    ethereum: any;
  }
}

const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });

const App = () => {
  const mounted = useIsMounted();
  const [contractAddresses, setContractAddresses] = useState<any>([]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { address, isConnected } = useAccount();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contractAddresses[0],
    abi: elecTrustV2ABI,
    functionName: "setCandidateName",
    // @ts-ignore
    account: address,
  });

  const {
    data: candidate,
    isError: error,
    isLoading: loading,
  } = useContractRead({
    address: contractAddresses[0],
    abi: elecTrustV2ABI,
    functionName: "getCandidateName",
    // @ts-ignore
    args: [1],
  });

  async function deployContract() {
    try {
      const client = createWalletClient({
        account: address,
        chain: sepolia,
        transport: custom(window.ethereum),
      });
      const hash = await client.deployContract({
        abi: elecTrustV2ABI,
        bytecode: process.env.NEXT_PUBLIC_BYTECODE as `0x${string}`,
        // @ts-ignore
        args: [3],
      });
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
      });
      const tx = await publicClient.waitForTransactionReceipt({
        hash,
      });
      setContractAddresses([...contractAddresses, tx.contractAddress]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log(candidateName);
  }, [candidateName]);

  return (
    <>
      <Navbar />
      <section className={`${poppins600.className} flex justify-center items-center relative h-screen w-full overflow-hidden bg-[FBF7F0]`}>
        <div
          className="flex flex-col h-[60vh] w-[80%] gap-5"
        >
          <div className="flex justify-between items-center mx-5">
            <h2 className="text-4xl">Votes</h2>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
                // deployContract();
              }}
              className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
            >
              + New Election
            </button>
          </div>
          <div className="flex h-[50vh] bg-white mx-5 p-3 rounded-2xl border-2 border-dashed border-black">
            <input
              placeholder="Candidate Number"
              onChange={(e) => setCandidateIndex(parseInt(e.target.value))}
            />
            <input
              placeholder="Name"
              onChange={(e) => setCandidateName(e.target.value)}
            />
            <button
              onClick={() => {
                write?.({
                  // @ts-ignore
                  args: [candidateIndex, candidateName],
                });
              }}
            >
              change name
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mx-5 ">
            <div className=" border-2 border-dashed border-black rounded-2xl h-[100px] p-5">
              {mounted && candidate}
            </div>
            <div className="border-2 border-dashed border-black rounded-2xl h-[100px] p-5">
              test
            </div>
          </div>
          <HoverDevCards />
        </div>
        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} contractAddresses={contractAddresses} setContractAddresses={setContractAddresses} />
      </section>
    </>
  );
};

const HoverDevCards = () => {
  return (
    <div className="p-4">
      <p className="text-xl font-semibold mb-2">Settings</p>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-2">
        <Card
          title="Account"
          subtitle="Manage profile"
          href="#"
          Icon={FiUser}
        />
        <Card title="Email" subtitle="Manage email" href="#" Icon={FiMail} />
        {/* <Card title="Team" subtitle="Manage team" href="#" Icon={FiUsers} />
        <Card
          title="Billing"
          subtitle="Manage cards"
          href="#"
          Icon={FiCreditCard}
        /> */}
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href }: any) => {
  return (
    <a
      href={href}
      className="w-full p-4 rounded-2xl border-[1px] border-slate-300 relative overflow-hidden group bg-white"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-black translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-slate-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-slate-950 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-slate-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </a>
  );
};

export default App;
