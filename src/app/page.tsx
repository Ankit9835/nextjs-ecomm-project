import { Suspense } from "react";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import LoadingContainer from "../components/global/LoadingContainer";

function HomePage() {
  return (
    <>
    <Hero />
    <Suspense fallback={<LoadingContainer />}>
      <FeaturedProducts />
    </Suspense>
    </>
  );
}
export default HomePage;