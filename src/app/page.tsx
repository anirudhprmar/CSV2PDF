import Container from "./_components/container";
import Hero from "./_components/hero";
import Navbar from "./_components/navbar";

export default function Page() {

    return (
    <div className="min-h-full relative ">

       <div className="max-w-5xl mx-auto absolute inset-0 h-full w-full pointer-events-none">
        <div className="absolute inset-y-0 left-0 h-screen border border-dashed bg-linear-to-b from-neutral-300/50 to-neutral-300 pointer-events-none z-0" />
        <div className="absolute inset-y-0 right-0 h-screen border border-dashed bg-linear-to-b from-neutral-300/50 to-neutral-300 pointer-events-none z-0" />
      </div>

      <Container>

        <Navbar/>
        <Hero/>

      </Container>
      
    </div>
  );
}
