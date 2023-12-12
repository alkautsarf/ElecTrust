import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiDollarSign, FiEye, FiPlay, FiSearch, FiLock } from "react-icons/fi";
import { FaEthereum } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { IoAccessibility } from "react-icons/io5";
import { Poppins } from "next/font/google";

const poppins400 = Poppins({ weight: "400", subsets: ["latin"] });
const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });

const SwapColumnFeatures = () => {
  const [featureInView, setFeatureInView] = useState(features[0]);

  return (
    <section className="relative mx-auto w-full bg-[#f6f8fa] rounded-[75px] border-dotted border-black border-4 p-[64px] z-30">
      <SlidingFeatureDisplay featureInView={featureInView} />

      {/* Offsets the height of SlidingFeatureDisplay so that it renders on top of Content to start */}
      <div className="-mt-[100vh] hidden md:block" />
      {features.map((s) => (
        <Content
          key={s.id}
          featureInView={s}
          setFeatureInView={setFeatureInView}
          {...s}
        />
      ))}
    </section>
  );
};

const SlidingFeatureDisplay = ({ featureInView }: any) => {
  return (
    <div
      style={{
        justifyContent:
          featureInView.contentPosition === "l" ? "flex-end" : "flex-start",
      }}
      className="pointer-events-none sticky top-0 z-10 hidden h-screen w-full items-center justify-center md:flex"
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className="h-fit w-3/5 rounded-xl p-8"
      >
        <ExampleFeature featureInView={featureInView} />
      </motion.div>
    </div>
  );
};

const Content = ({ setFeatureInView, featureInView }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "-150px",
  });

  useEffect(() => {
    if (isInView) {
      setFeatureInView(featureInView);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative z-0 flex h-fit md:h-screen"
      style={{
        justifyContent:
          featureInView.contentPosition === "l" ? "flex-start" : "flex-end",
      }}
    >
      <div className="grid h-full w-full place-content-center px-4 py-12 md:w-2/5 md:px-8 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span className="rounded-full bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white">
            {featureInView.callout}
          </span>
          <p className={`${poppins600.className} my-3 text-5xl font-bold`}>
            {featureInView.title}
          </p>
          <p className={`${poppins400.className} text-slate-600`}>
            {featureInView.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="mt-8 block md:hidden"
        >
          <ExampleFeature featureInView={featureInView} />
        </motion.div>
      </div>
    </section>
  );
};

const ExampleFeature = ({ featureInView }: any) => {
  return (
    <div className="relative h-96 w-full rounded-xl bg-slate-800 shadow-xl">
      <div className="flex w-full gap-1.5 rounded-t-xl bg-slate-900 p-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <div className="p-2">
        {featureInView.id == 1 && (
          <p className="font-mono text-sm text-slate-200">
            <span className="text-green-300">~</span> Snippet of{" "}
            <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
              "Ownable.sol"
            </span>{" "}
            .
          </p>
        )}
        {featureInView.id == 2 && (
          <p className="font-mono text-sm text-slate-200">
            <span className="text-green-300">~</span> What is{" "}
            <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
              Ethereum
            </span>{" "}
            ?
          </p>
        )}
        {featureInView.id == 3 && (
          <p className="font-mono text-sm text-slate-200">
            <span className="text-green-300">~</span> Snippet of{" "}
            <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
              "ElecTrust.sol"
            </span>{" "}
            .
          </p>
        )}
        <br />

        {featureInView.id == 1 && (
          <>
            <p className="font-mono text-sm text-blue-400">
              <span className="text-green-300">~</span>
              <span className="text-purple-400"> modifier</span> {`onlyOwner`}
              <span className="text-purple-400">{`() {`}</span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;_checkOwner
                <span className="text-blue-300">()</span>
                <span className="text-slate-200">;</span>
              </span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;_
                <span className="text-slate-200">;</span>
              </span>
              <br />
              <span className="text-purple-400">&nbsp;&nbsp;{`}`}</span>
            </p>
            <br />
            <p className="font-mono text-sm text-blue-400 z-100 relative">
              <span className="text-green-300">~</span>
              <span className="text-purple-400"> function</span> {`_checkOwner`}
              <span className="text-purple-400">{`() internal view virtual {`}</span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">if</span>
                &nbsp;(owner<span className="text-yellow-300">()</span>&nbsp;
                <span className="text-green-200">!=</span>&nbsp;_msg.sender
                <span className="text-yellow-300">()</span>)&nbsp;{`{`}
              </span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">revert</span>
                &nbsp;OwnableUnauthorizedAccount
                <span className="text-yellow-300">
                  (
                  <span className="text-blue-400">
                    _msgSender<span className="text-purple-400">()</span>
                  </span>
                  )<span className="text-slate-200">;</span>
                </span>
              </span>
              <br />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;{`}`}</span>
              <br />
              <span className="text-purple-400">&nbsp;&nbsp;{`}`}</span>
            </p>
          </>
        )}
        {featureInView.id == 2 && (
          <>
            <p className="font-mono text-sm text-slate-200">
              <span className="text-green-300">~</span>&nbsp;
              <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
                Ethereum
              </span>{" "}
              is a{" "}
              <span className="inline-block rounded px-1 font-semibold underline-offset-2 decoration-2 underline decoration-yellow-400">
                decentralized
              </span>
              ,{" "}
              <span className="inline-block rounded px-1 font-semibold underline-offset-2 decoration-2 underline decoration-lime-300">
                open-source
              </span>
              , and{" "}
              <span className="inline-block rounded px-1 font-semibold underline-offset-2 decoration-2 underline decoration-pink-400">
                permissionless
              </span>{" "}
              blockchain. It means there is no single entity,
              government, or organization that controls the entire network.
              Decentralized approach also provides resistance against{" "}
              <span className="inline-block rounded px-1 font-semibold underline-offset-2 decoration-2 underline decoration-rose-700">
                censorship
              </span>{" "}
              and{" "}
              <span className="inline-block rounded px-1 font-semibold underline-offset-2 decoration-2 underline decoration-sky-300">
                interference
              </span>
              .
            </p>
            <br />
            <p className="font-mono text-sm text-slate-200">
              <span className="text-green-300">~</span> Who is the founder of{" "}
              <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
                Ethereum
              </span>{" "}
              ?
            </p>
            <br />
            <p className="font-mono text-sm text-slate-200">
              <span className="text-green-300">~</span>{" "}
              <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
                Ethereum
              </span>{" "}
              was originally proposed by a Russian-Canadian programmer named{" "}
              <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
                Vitalik Buterin
              </span>
              , who co-founded the project with an impressive pantheon of
              programmers, media entrepreneurs, and technologists.
            </p>
          </>
        )}
        {featureInView.id == 3 && (
          <>
            <p className="font-mono text-sm text-blue-400 z-100 relative">
              <span className="text-green-300">~</span>
              <span className="text-purple-400"> function</span> {`setVote`}
              <span className="text-purple-400">
                (
                <span className="text-lime-300">
                  uint256&nbsp;<span className="text-teal-300">_vote</span>
                </span>
                )&nbsp;{`external {`}
              </span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">require</span>
                &nbsp;(
                <span className="text-teal-300">
                  !
                  <span className="text-slate-200">
                    _voted
                    <span className="text-yellow-300">
                      [<span className="text-teal-300">msg.sender</span>]
                      <span className="text-slate-200">
                        ,&nbsp;
                        <span className="text-orange-300">"Already Voted"</span>
                      </span>
                    </span>
                  </span>
                </span>
                )<span className="text-slate-200">;</span>&nbsp;
              </span>
              <br />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">require</span>
                &nbsp;(
                <span className="text-teal-300">
                  <span className="text-slate-200">
                    _vote&nbsp;
                    <span className="text-teal-300">
                      {`>`} <span className="text-orange-400">0&nbsp;</span>
                      &&&nbsp;
                      <span className="text-slate-200">_vote&nbsp;</span>
                      {"<"}&nbsp;<span className="text-orange-400">4</span>
                    </span>
                    ,&nbsp;
                    <span className="text-orange-300">
                      "Cannot Vote For This Candidate"
                    </span>
                  </span>
                </span>
                )<span className="text-slate-200">;</span>&nbsp;
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-slate-200">_voted</span>[
              <span className="text-teal-300">msg.sender</span>]&nbsp;
              <span className="text-purple-400">=</span>&nbsp;
              <span className="text-rose-500">true</span>
              <span className="text-slate-200">;</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-purple-400">unchecked&nbsp;</span>
              {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-purple-400">
                if&nbsp;
                <span className="text-yellow-300">
                  (
                  <span className="text-slate-200">
                    _vote&nbsp;
                    <span className="text-teal-300">
                      ==&nbsp;<span className="text-orange-400">1</span>
                    </span>
                  </span>
                  )&nbsp;{"{"}
                </span>
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-slate-200">
                _votes
                <span className="text-purple-400">
                  [<span className="text-slate-200">Vote.Candidate1</span>]++
                </span>
                ;
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-yellow-300">
                {`}`}&nbsp;
                <span className="text-purple-400">
                  else if&nbsp;
                  <span className="text-yellow-300">
                    (
                    <span className="text-slate-200">
                      _vote&nbsp;
                      <span className="text-teal-300">
                        ==&nbsp;<span className="text-orange-400">2</span>
                      </span>
                    </span>
                    )&nbsp;{"{"}
                  </span>
                </span>
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-slate-200">
                _votes
                <span className="text-purple-400">
                  [<span className="text-slate-200">Vote.Candidate2</span>]++
                </span>
                ;
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-yellow-300">
                {`}`}&nbsp;
                <span className="text-purple-400">
                  else if&nbsp;
                  <span className="text-yellow-300">
                    (
                    <span className="text-slate-200">
                      _vote&nbsp;
                      <span className="text-teal-300">
                        ==&nbsp;<span className="text-orange-400">3</span>
                      </span>
                    </span>
                    )&nbsp;{"{"}
                  </span>
                </span>
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-slate-200">
                _votes
                <span className="text-purple-400">
                  [<span className="text-slate-200">Vote.Candidate3</span>]++
                </span>
                ;
              </span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-yellow-300">{`}`}</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-blue-400">{`}`}</span>
              <br />
              <span className="text-purple-400">&nbsp;&nbsp;{`}`}</span>
            </p>
          </>
        )}
      </div>
      <span className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] text-9xl text-slate-700 z-0">
        {featureInView.id == 4 && <featureInView.Icon /> }
      </span>
    </div>
  );
};

export default SwapColumnFeatures;

const features = [
  {
    id: 1,
    callout: "Security",
    title: "It's Safe",
    description:
      "Utilizes a decentralized blockchain to record each vote as a secure and immutable transaction. This ensures that once a vote is cast, it cannot be altered or tampered with, providing a transparent and trustworthy electoral history.",
    contentPosition: "r",
    Icon: FiLock,
  },
  {
    id: 2,
    callout: "Decentralized",
    title: "It's Decentralized",
    description:
      "Removes the reliance on a central authority, reducing the risk of manipulation and fraud. The decentralized nature ensures that no single point of failure exists in the electoral process.",
    contentPosition: "l",
    Icon: FaEthereum,
  },
  {
    id: 3,
    callout: "Verifiable",
    title: "It's Verifiable",
    description:
      "Facilitates easy and verifiable audits of the election results. Election authorities, candidates, and the public can independently verify the authenticity of each vote by examining the blockchain .",
    contentPosition: "r",
    Icon: MdVerified,
  },
  {
    id: 4,
    callout: "Accessibility",
    title: "It's Inclusive",
    description:
      "Strives to enhance accessibility by allowing voters to cast their ballots remotely using digital devices. This approach aims to increase voter turnout and make the voting process more convenient for a broader range of citizens.",
    contentPosition: "l",
    Icon: IoAccessibility,
  },
];
