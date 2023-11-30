import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrippyHero from "@/components/Trippy";
import TerminalContact from "@/components/Terminal";
import FuzzyOverlayExample from "@/components/Terminal";
import Example from "@/components/Column";

const Home = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <TerminalContact />
      {/* <Example /> */}
      {/* <FuzzyOverlayExample /> */}
      {/* <TrippyHero /> */}
    </div>
  );
};

export default Home;


