import Container from "./_components/container";
import FAQs from "./_components/faqs";
import Features from "./_components/features";
import Footer from "./_components/footer";
import FooterCTA from "./_components/footercta";
import Hero from "./_components/hero";
import Navbar from "./_components/navbar";

export default function Page() {

    return (
    <div className="min-h-full relative ">

       <div className="max-w-5xl mx-auto absolute inset-0 h-full w-full pointer-events-none ">

        <div className="absolute inset-y-0 left-0 h-full border border-dashed bg-linear-to-b from-neutral-300/50 to-neutral-300 pointer-events-none z-0" />
        <div className="absolute inset-y-0 right-0 h-full border border-dashed bg-linear-to-b from-neutral-300/50 to-neutral-300 pointer-events-none z-0" />

      </div>

      <Container>

        <Navbar/>
        <Hero/>
        <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>
        <Features/>

        <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>

        <div className="flex flex-col items-center border-b border-dashed py-4">
          <div className="flex flex-row items-center gap-2 px-6">
            <div className="flex flex-row items-center">
              <div className="from-muted h-px w-20 bg-linear-to-l to-transparent sm:w-40">
              </div>
              <div className="bg-muted/20 h-1.5 w-1.5 border"></div>
              </div>
              <div className="bg-muted/20 jetbrains-mono relative flex h-7 flex-row items-center whitespace-nowrap gap-2 rounded-md border px-4 text-sm font-medium">
              <span>FAQ&apos;s</span>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-muted/20 h-1.5 w-1.5 border">
                </div>
                <div className="from-muted h-px w-20 bg-linear-to-r to-transparent sm:w-40"></div>
                </div>
          </div>
        </div>

        <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>

        <FAQs/>

        <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>

        <FooterCTA/>

         <div className="relative">
          <div className="h-px w-full absolute border border-dashed bg-linear-to-t from-neutral-300 to-neutral-300 pointer-events-none z-0"/>
        </div>

        <Footer/>
      </Container>
      
      
    </div>
  );
}
