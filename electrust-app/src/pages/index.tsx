import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Terminal from "@/components/Terminal";
import FuzzyOverlayExample from "@/components/Terminal";
import Example from "@/components/Column";
import SwapColumnFeatures from "@/components/Column";
import Footer from "@/components/Footer";
import GlassNavigation from "@/components/NavbarHome";

const Home = () => {
  return (
    <div className="bg-white" id="home">
      <Navbar />
      {/* <GlassNavigation /> */}
      <Hero />
      <Terminal />
      <SwapColumnFeatures />
      <Footer />
    </div>
  );
};

export default Home;
