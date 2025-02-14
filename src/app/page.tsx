import Image from "next/image";
import LoginModule from "@/components/login/LoginModule";
import { Metadata } from "next";
import sideLogin from "@/assets/sideLogin.png"

export default function Login() {

  return (
    <>
      <div className="w-full mx-auto overflow-y-hidden flex flex-row h-screen ">

        <div className="hidden xl:block">
          <Image className="z-0 hidden min-[1600px]:block min-[1600px]:w-[1024px] min-[1600px]:h-[1024px]" src={sideLogin} alt="sideLogin" />
        </div>

        <div className="relative hidden h-full w-3/5 flex-col bg-muted p-10 text-white xl:flex min-[1600px]:hidden dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Abnormal Inc
          </div>
          <div className="relative z-10 mt-auto pr-8">
            <blockquote className="space-y-2">
              <p className="text-base">
                &ldquo;Believing in yourself is the first step to success.
                Stay focused, work hard, and never give up, as perseverance always leads to
                remarkable achievements &rdquo;
              </p>
              <footer className="text-sm">-CoolGuy</footer>
            </blockquote>
          </div>
        </div>


          <div className="z-20 mx-auto w-2/3 lg:w-1/2 xl:-ml-12 2xl:-ml-16 xl:bg-white flex flex-col justify-center lg:rounded-l-[48px]">
            <LoginModule />
          </div>


      </div>
    </>
  );
}
