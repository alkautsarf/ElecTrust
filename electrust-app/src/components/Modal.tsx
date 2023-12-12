import { AnimatePresence, motion } from "framer-motion";
import { FaEthereum } from "react-icons/fa6";
import { useAccount } from "wagmi";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Fragment, useEffect, useRef, useState } from "react";
import { deployContract } from "@/scripts/contract";
import Link from "next/link";

declare global {
  interface Window {
    ethereum: any;
  }
}

const SpringModal = ({
  isOpen,
  setIsOpen,
  contractAddresses,
  setContractAddresses,
}: any) => {
  const { address } = useAccount();

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
            className="sm:max-w-sm md:max-w-2xl lg:max-w-full"
          >
            <FaEthereum className="text-black/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-black grid place-items-center mx-auto">
                <FaEthereum />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Create Your Election
              </h3>
              <TerminalContact
                address={address}
                contractAddresses={contractAddresses}
                setContractAddresses={setContractAddresses}
                setIsOpen={setIsOpen}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;

const TerminalContact = ({
  address,
  contractAddresses,
  setContractAddresses,
  setIsOpen,
}: any) => {
  const containerRef = useRef(null);
  const inputRef: any = useRef(null);

  return (
    <section
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="px-4 py-6 bg-inherit"
    >
      <div
        ref={containerRef}
        onClick={() => {
          inputRef.current?.focus();
        }}
        className="h-96 bg-slate-950/70 backdrop-blur rounded-lg w-full max-w-3xl mx-auto overflow-y-scroll no-scrollbar shadow-xl cursor-text font-mono"
      >
        <TerminalHeader />
        <TerminalBody
          inputRef={inputRef}
          containerRef={containerRef}
          address={address}
          contractAddresses={contractAddresses}
          setContractAddresses={setContractAddresses}
          setIsOpen={setIsOpen}
        />
      </div>
    </section>
  );
};

const TerminalHeader = () => {
  return (
    <div className="w-full p-3 bg-slate-900 flex items-center gap-1 sticky top-0">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-sm text-slate-200 font-semibold absolute left-[50%] -translate-x-[50%]">
        alkautsarsol22@gmail.com
      </span>
    </div>
  );
};

const TerminalBody = ({
  containerRef,
  inputRef,
  address,
  contractAddresses,
  setContractAddresses,
  setIsOpen,
}: any) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");

  const [questions, setQuestions] = useState(QUESTIONS);

  const curQuestion = questions.find((q) => !q.complete);

  const handleSubmitLine = (value: any) => {
    if (curQuestion) {
      setQuestions((pv) =>
        pv.map((q) => {
          if (q.key === curQuestion.key) {
            return {
              ...q,
              complete: true,
              value,
            };
          }
          return q;
        })
      );
    }
  };

  return (
    <div className="p-2 text-slate-100 text-lg">
      <InitialText />
      <PreviousQuestions questions={questions} />
      <CurrentQuestion curQuestion={curQuestion} />
      {curQuestion ? (
        <CurLine
          text={text}
          focused={focused}
          setText={setText}
          setFocused={setFocused}
          inputRef={inputRef}
          command={curQuestion?.key || ""}
          handleSubmitLine={handleSubmitLine}
          containerRef={containerRef}
        />
      ) : (
        <Summary
          questions={questions}
          setQuestions={setQuestions}
          address={address}
          contractAddresses={contractAddresses}
          setContractAddresses={setContractAddresses}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

const InitialText = () => {
  return (
    <>
      <p>Hey there! Let's create your election 🎉</p>
      <p className="whitespace-nowrap overflow-hidden font-light">
        ------------------------------------------------------------------------
      </p>
    </>
  );
};

const PreviousQuestions = ({ questions }: any) => {
  return (
    <>
      {questions.map((q: any, i: any) => {
        if (q.complete) {
          return (
            <Fragment key={i}>
              <p>
                {q.text || ""}
                {q.postfix && (
                  <span className="text-violet-300">{q.postfix}</span>
                )}
              </p>
              <p className="text-emerald-300">
                <FiCheckCircle className="inline-block mr-2" />
                <span>{q.value}</span>
              </p>
            </Fragment>
          );
        }
        return <Fragment key={i}></Fragment>;
      })}
    </>
  );
};

const CurrentQuestion = ({ curQuestion }: any) => {
  if (!curQuestion) return <></>;

  return (
    <p>
      {curQuestion.text || ""}
      {curQuestion.postfix && (
        <span className="text-violet-300">{curQuestion.postfix}</span>
      )}
    </p>
  );
};

const Summary = ({
  questions,
  setQuestions,
  address,
  contractAddresses,
  setContractAddresses,
  setIsOpen,
}: any) => {
  const [complete, setComplete] = useState(false);
  const [success, setSuccess] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleReset = () => {
    setQuestions((pv: any) =>
      pv.map((q: any) => ({ ...q, value: "", complete: false }))
    );
  };

  const handleSend = async () => {
    const formData = questions.reduce((acc: any, val: any) => {
      return { ...acc, [val.key]: val.value };
    }, {});
    setComplete(true);
    const ca: any = await deployContract(
      address,
      formData.name,
      +formData.number,
      +formData.duration || 1,
      formData.candidateName,
    );
    ca.length > 0 && setTxHash(ca);
    ca?.cause?.code == 4001
      ? setSuccess("User rejected the tx :(")
      : setSuccess("");
  };

  return (
    <>
      <p>Beautiful! Here's what we've got:</p>
      {questions.map((q: any) => {
        return (
          <p key={q.key}>
            <span className="text-blue-300">{q.key}:</span> {q.value}
          </p>
        );
      })}
      <p>Look good?</p>
      {complete && success.length == 0 ? (
        <p className="text-emerald-300 truncate">
          <FiCheckCircle className="inline-block mr-2" />
          <Link href={`https://sepolia.etherscan.io/tx/${txHash}`}>
            <span>
              {txHash.length > 0
                ? <span className="underline">Deployed</span>
                : "Your contract being deployed 🚀"}
            </span>
          </Link>
        </p>
      ) : success ? (
        <p className="text-rose-500">
          <FiXCircle className="inline-block mr-2" />
          <span>{success}</span>
        </p>
      ) : (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-slate-100 text-black"
          >
            Restart
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-indigo-500 text-white"
          >
            Deploy!
          </button>
        </div>
      )}
    </>
  );
};

const CurLine = ({
  text,
  focused,
  setText,
  setFocused,
  inputRef,
  command,
  handleSubmitLine,
  containerRef,
}: any) => {
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleSubmitLine(text);
    setText("");
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  const onChange = (e: any) => {
    setText(e.target.value);
    scrollToBottom();
  };

  useEffect(() => {
    return () => setFocused(false);
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          onChange={onChange}
          value={text}
          type="text"
          className="sr-only"
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </form>
      <p>
        <span className="text-emerald-400">➜</span>{" "}
        <span className="text-cyan-300">~</span>{" "}
        {command && <span className="opacity-50">Enter {command}: </span>}
        {text}
        {focused && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
              times: [0, 0.5, 0.5, 1],
            }}
            className="inline-block w-2 h-5 bg-slate-400 translate-y-1 ml-0.5"
          />
        )}
      </p>
    </>
  );
};

const QUESTIONS = [
  {
    key: "name",
    text: "To start, what will you name",
    postfix: " your election ?",
    complete: false,
    value: "",
  },
  {
    key: "number",
    text: "Awesome! And how many candidate",
    postfix: " will participate ?",
    complete: false,
    value: "",
  },
  {
    key: "candidateName",
    text: "Perfect, now please set the name of each candidate seperated by ",
    postfix: "commas!",
    complete: false,
    value: "",
  },
  {
    key: "duration",
    text: "Now, how long this vote will last in ",
    postfix: "days format ?",
    complete: false,
    value: "",
  },
];
