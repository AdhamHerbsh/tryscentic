import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { RegisterForm } from "@/components/ui/Forms/RegisterForm";
import Video from "@/components/ui/Videos/Video";

export default function RegisterPage() {
  return (
    // Equivalent to .pageContainer for structural layout (bg gradient is kept in CSS module, but min-h-screen and flex are here)
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]">
      <AnimatedBackground />
      {/* Equivalent to .contentContainer: relative, z-10, flex, gap-6/8, max-w-7xl, mx-auto, padding, and responsive stacking (lg:flex-row) */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* RegisterForm component will handle its own container width logic */}
        <div className="w-full lg:w-1/3 xl:w-2/5">
          <RegisterForm />
        </div>

        {/* Equivalent to .imageSection/Video Container: width and centering. The aspect ratio is handled by the video component itself. */}
        <div className="flex w-full lg:w-2/3 xl:w-3/5 items-center justify-center">
          <div className="relative w-full h-auto xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <Video />
          </div>
        </div>
      </div>
    </main>
  );
}