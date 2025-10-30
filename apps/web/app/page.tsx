import CTASection from "../components/cta";
import Features from "../components/features";
import Herosection from "../components/herosection";
import Navbar from "../components/navbar";

export default function Page() {
  return (
    <div className="flex flex-col w-screen ">
      <Navbar />
      <Herosection />
      <Features />
      <CTASection />
    </div>
  );
}
