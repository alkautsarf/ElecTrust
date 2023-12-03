import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Fragment, useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
const poppins500 = Poppins({ weight: "500", subsets: ["latin"] });

const Terminal = () => {
  const containerRef = useRef(null);
  const inputRef: any = useRef(null);

  return (
    <section className="mx-10 flex justify-center items-center gap-6 h-[120vh] flex-col" id="about">
      <div>
        <h2 className={`${poppins500.className} text-8xl px-6 py-3`}>
          What is
        </h2>
        <h2
          className={`${poppins500.className} text-8xl pointer-events-auto rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none`}
        >
          elecTrust ?
        </h2>
      </div>
      <div
        ref={containerRef}
        className=" bg-slate-950/70 backdrop-blur rounded-lg w-full max-w-3xl mx-auto overflow-y-scroll shadow-xl cursor-text font-mono mt-8 "
      >
        <TerminalHeader />
        <TerminalBody inputRef={inputRef} containerRef={containerRef} />
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

const TerminalBody = ({ containerRef, inputRef }: any) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");

  const [questions, setQuestions] = useState(QUESTIONS);

  const curQuestion = questions.find((q) => !q.complete);

  return (
    <div className="p-2 text-slate-100 text-lg">
      <CurLine
        text={text}
        focused={focused}
        setText={setText}
        setFocused={setFocused}
        inputRef={inputRef}
        command={curQuestion?.key || ""}
        containerRef={containerRef}
      />
    </div>
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
        <span className="opacity-50">
          elecTrust is a blockchain-based voting system designed to
          revolutionize and enhance the electoral process by prioritizing trust,
          transparency, and security. The platform leverages the inherent
          characteristics of blockchain technology to create a tamper-resistant
          and verifiable for recording votes in elections.
        </span>
      </p>
    </>
  );
};

export default Terminal;

const QUESTIONS = [
  {
    key: "email",
    text: "To start, could you give us ",
    postfix: "your email?",
    complete: false,
    value: "",
  },
  {
    key: "name",
    text: "Awesome! And what's ",
    postfix: "your name?",
    complete: false,
    value: "",
  },
  {
    key: "description",
    text: "Perfect, and ",
    postfix: "how can we help you?",
    complete: false,
    value: "",
  },
];
