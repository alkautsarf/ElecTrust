import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import { useAccount } from "wagmi";
import SpringModal from "@/components/Modal";
import Table from "@/components/Table";
import { GetServerSideProps } from "next";
import { readElectionInfo } from "@/scripts/contract";
import { AnimatePresence } from "framer-motion";
import Notification from "@/components/Notification";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { IoMdRefresh } from "react-icons/io";

declare global {
  interface Window {
    ethereum: any;
  }
}

const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });

const App = ({ electionInfo }: any) => {
  const [contractAddresses, setContractAddresses] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  const { isConnected } = useAccount();
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [electionInfo]);

  const removeNotif = () => {
    setNotification(null);
  };

  return (
    <>
      <Navbar />
      <section
        className={`${poppins600.className} flex justify-center items-center relative h-screen w-full overflow-hidden bg-[FBF7F0]`}
      >
        <div className="flex flex-col h-[60vh] w-[80%] gap-5">
          <div className="flex justify-between items-center ">
            <h2 className="text-4xl">Votes</h2>
            <div className="flex items-center gap-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  refreshData();
                }}
                className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-[17px] font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
              >
                <IoMdRefresh />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isConnected ? setIsOpen(true) : setNotification(true);
                }}
                className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
              >
                + New Election
              </button>
            </div>
          </div>
          <Table
            electionInfo={electionInfo}
            setNotification={setNotification}
            isConnected={isConnected}
            refreshData={refreshData}
          />
        </div>
        <SpringModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          contractAddresses={contractAddresses}
          setContractAddresses={setContractAddresses}
        />
        <AnimatePresence>
          {notification && (
            <Notification
              removeNotif={removeNotif}
              key={1}
              text={"Please Connect Your Wallet 🫡"}
            />
          )}
        </AnimatePresence>
        {isRefreshing && <Loader />}
      </section>
      <div className="h-[15vh]"></div>
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

export const getServerSideProps: GetServerSideProps = async () => {
  let transformedInfo: any;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/contractAddress`
    );
    const result = await response.json();

    console.log(result)

    const electionInfoPromises = result.map((item: any) => {
      return readElectionInfo(item.contractAddress);
    });

    transformedInfo = await Promise.all(electionInfoPromises);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      electionInfo: transformedInfo,
    },
  };
};
