import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import ConnectButton from "./ConnectButton";

interface IHeaderProps {}

const Header = (props: IHeaderProps) => {
  return (
    <header className="grid grid-cols-2 gap-x-4 max-w-[1440px] mx-auto lg:w-3/4 px-2 py-2 z-10">
      {/* Left */}
      <div className="flex space-x-8 items-center justify-start">
        <Link href="/" className="flex items-center space-x-2 z-10">
          <Image
            src="/images/logo.jpg"
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
          <h2 className="font-extrabold hidden lg:flex text-xl leading-[24px] text-primary items-center">
            ASC
            <span className="text-secondary font-bold text-3xl items-center">
              .
            </span>
            <span className="text-light font-bold text-xl items-center">_</span>
          </h2>
        </Link>{" "}
        <div className="px-4 py-2 w-1/2 border border-gray-400 rounded-xl text-gray-400 font-light text-sm hidden md:flex relative">
          Just for Fun
          <button className="cursor-pointer absolute right-2">
            <CiSearch className="text-[22px]" />
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex space-x-4 items-center justify-end">
        <nav>
          <ul className="hidden lg:flex items-center justify-between space-x-4 font-light text-[14px]">
            <Link
              href="/items"
              className="flex flex-col items-end justify-end group"
            >
              <p className="text-[12px] text-gray-500 group-hover:animate-ping">
                01 //
              </p>
              <li className="text-[15px] text-gray-600 group-hover:underline">
                Inventory
              </li>
            </Link>
            <Link
              href="/auctions"
              className="flex flex-col items-end justify-end group"
            >
              <p className="text-[12px] text-gray-500 group-hover:animate-ping">
                02 //
              </p>
              <li className="text-[15px] text-gray-600 group-hover:underline">
                Auctions
              </li>
            </Link>
            <Link
              href="/users"
              className="flex flex-col items-end justify-end group"
            >
              <p className="text-[12px] text-gray-500 group-hover:animate-ping">
                03 //
              </p>
              <li className="text-[15px] text-gray-600 group-hover:underline">
                About Me
              </li>
            </Link>
          </ul>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
