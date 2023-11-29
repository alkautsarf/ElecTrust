import { Nova_Square } from "next/font/google";

const vina = Nova_Square({ weight: "400", subsets: ["latin"] });

const Navbar = () => {
  return (
    <div className={`${vina.className} flex p-5`}>
      <div className="flex flex-col w-[30%] p-3">
        <h2 className="text-5xl">Elec<span id="shadow">Trust</span></h2>
        <h2 className="text-xs ml-1">Redefining Trust</h2>
      </div>
      <div className="flex flex-grow justify-evenly gap-3 p-7 text-xl">
        <h2>About</h2>
        <h2>Features</h2>
        <h2>test</h2>
      </div>
    </div>
  );
};

export default Navbar;
