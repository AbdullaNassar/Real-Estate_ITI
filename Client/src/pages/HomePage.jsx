import Hero from "../component/landingPage/Hero";
import ListsContainer from "../features/Lists/ListsContainer";
import HowItWork from "../component/landingPage/HowItWork";
import Features from "../component/landingPage/Features";
import Testimonials from "../component/landingPage/Testimonials";
import Cta from "../component/landingPage/Cta";
import ShowCase from "../component/landingPage/ShowCase";

export default function HomePage() {
  return (
    <div className="bg-gray-100 flex flex-col ">
      <Hero />

      <HowItWork />

      {/* <ShowCase /> */}
      <ListsContainer />

      <Features />

      <Testimonials />
      <Cta />
    </div>
  );
}
