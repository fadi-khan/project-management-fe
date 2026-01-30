import { SignupModal } from "@/components/auth/SignUpModal";


export default function SignupPage() {
  return (
    <div className="flex md:flex-row flex-col items-center h-screen gap-x-16 mx-auto">
      <div className="md:block hidden bg-white  h-full w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-white text-center px-4 ">
            Project Management System
          </h1>
        </div>

        <div className="w-1/2 bg-blue-900 h-full ">
          <div className="fixed text-white bg-blue-900 lg:rotate-45 md:rotate-0 h-full w-1/2 rounded-sm border-e-2"></div>
        </div>
      </div>
      <h1 className="text-3xl w-full my-12  md:hidden md:text-4xl font-semibold tracking-wide text-blue-900 text-center px-4 ">
        Project Management System
      </h1>
      <div className="relative z-50 md:mx-auto   lg:justify-center flex w-full md:w-1/2">
        <SignupModal />
      </div>
    </div>
  );
}