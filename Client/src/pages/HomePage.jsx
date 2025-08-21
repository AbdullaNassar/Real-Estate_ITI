import Hero from "../component/landingPage/Hero";
import ListsContainer from "../features/Lists/ListsContainer";
import HowItWork from "../component/landingPage/HowItWork";
import Features from "../component/landingPage/Features";
import Testimonials from "../component/landingPage/Testimonials";
import Cta from "../component/landingPage/Cta";
import ShowCase from "../component/landingPage/ShowCase";
import BackToTop from "../component/BackToTop";
import { Helmet } from "react-helmet";
import SEO from "../component/SEO";

export default function HomePage() {
  return (
    <div className="bg-gray-100 flex flex-col ">
      <SEO
        title="Maskn | Rent Homes Across Egypt"
        description="Find and book apartments, villas, and unique stays across Egypt with Maskn."
      />
      <Hero />

      <HowItWork />

      {/* <ShowCase /> */}
      <ListsContainer />

      <Features />

      <Testimonials />
      <Cta />
      <BackToTop />
    </div>
  );
}
