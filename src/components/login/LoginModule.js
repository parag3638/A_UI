import { AccountForm } from "./AccountForm";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import logo from "@/assets/google.png";
import Image from "next/image";
import Link from 'next/link';
import localFont from 'next/font/local';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
const Nunito = localFont({ src: '../../assets/fonts/NunitoSans-VariableFont.ttf' })


export default function LoginModule() {
    return (
        <div className="w-full">
            {/* <div className="absolute top-0 right-0 px-8 py-6">
                <SidebarModeToggle />
            </div> */}
            <div className={`${Nunito.className} w-full flex flex-col items-center justify-center h-full`}>
                <div className="w-3/4 2xl:w-1/2">
                    <div className="py-2 pb-2 self-start">
                        <div className="text-[#525252] text-4xl font-bold">Login to your Account</div>
                        <div className="text-[#525252] text-base font-medium pt-1">Impossible is what we do best!</div>
                    </div>

                    <div className="py-2 self-start">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className='w-full py-5 border-gray-200 hover:bg-[#F4F4F5] dark:text-[#828282] bg-white rounded-lg font-semibold text-[#828282] text-sm' variant="outline" ><Image src={logo} alt="" className="w-4 mr-[10px]" />Continue with Google</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Under Development</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="py-6 px-8">
                        <Separator className="bg-[#F2F2F3]" />
                    </div>
                    <div className="space-y-6">
                        <AccountForm />
                    </div>

                    <div>

                    </div>

                    <div className="flex flex-row pt-12 justify-center text-sm">
                        <div className="pr-[6px] text-[#828282] font-[400]">Not Registered Yet? </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/">
                                        <div className="text-red-700 font-bold hover:cursor-pointer"> Create an Account</div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Not Available</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
