"use client"
import { IoMdClose } from "react-icons/io"
import Link from "next/link"
import { MdOutlineCheckBox, MdOutlineFolder, MdOutlineHome } from "react-icons/md"
import { usePathname } from "next/navigation"
export const MobileSideBar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (x: boolean) => void }) => {

  const pathname = usePathname()

  return (
    <div

      className={` lg:flex lg:sticky -col z-30 min-w-64 w-full bg-blue-900 lg:bg-white lg:border-e border-blue-900 md:w-fit fixed top-0 left-0 h-screen transform transition-transform duration-500 ease-in-out
      ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none lg:translate-x-0 lg:pointer-events-auto'}`}
    >
      <div className=" lg:hidden px-7   py-8 text-white shadow-gray-50 flex justify-between items-center border-b border-blue-900">
        <div className="text-xl tracking-wider font-semibold ">TPS</div>
        <IoMdClose size={24} className="cursor-pointer" onClick={() => { setIsOpen(false) }} />
      </div>
      <ul className="px-4 flex flex-col w-full  gap-5 lg:text-blue-900 text-white font-medium mt-20 text-start">


        <Link
          onClick={() => { setIsOpen(false) }}
          className={`p-2 cursor-pointer hover:bg-blue-900 hover:text-white rounded-md flex items-center gap-2 ${pathname?.startsWith('/dashboard') ? 'bg-blue-900 text-white' : ''}`}
          href="/dashboard">
          <MdOutlineHome size={26} className="cursor-pointer" />
          <div className="text-lg  ">Dashboard</div>
        </Link>

        <Link
          onClick={() => { setIsOpen(false) }}
          className={`p-2 cursor-pointer hover:bg-blue-900 hover:text-white rounded-md flex items-center gap-2 ${pathname?.startsWith('/projects') ? 'bg-blue-900 text-white' : ''}`}
          href="/projects">
          <MdOutlineFolder size={24} className="cursor-pointer" />
          <div className="text-lg  ">Projects</div>
        </Link>


        <Link
          onClick={() => { setIsOpen(false) }}
          className={`p-2 cursor-pointer hover:bg-blue-900 hover:text-white rounded-md flex items-center gap-2 ${pathname?.startsWith('/tasks') ? 'bg-blue-900 text-white' : ''}`}
          href="/tasks">
          <MdOutlineCheckBox size={24} className="cursor-pointer" />
          <div className="text-lg ">Tasks</div>
        </Link>
      </ul>
    </div>
  )

}