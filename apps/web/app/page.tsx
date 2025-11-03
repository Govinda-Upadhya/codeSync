import { getServerSession } from "next-auth";
import CTASection from "../components/cta";
import Features from "../components/features";
import Herosection from "../components/herosection";
import Navbar from "../components/navbar";

export default async function Page() {
  const sessions = await getServerSession();
  console.log("session after logoiut", sessions);
  let loggedIn = false;
  if (sessions) {
    loggedIn = true;
  }
  return (
    <div className="flex flex-col w-screen ">
      <Navbar loggedin={loggedIn} />
      <Herosection isLoggedIn={loggedIn} />
      <Features />
      <CTASection />
    </div>
  );
}
