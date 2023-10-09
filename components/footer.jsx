import Link from "next/link";
import Image from "next/image";
import bpmLogo from "public/bpm-logomain.png";
import SocialLinks from "./sociallinks";

function Footer() {
  return (
    <footer className="pb-10">
      <hr className="mx-auto mb-5 w-[90vw] border-gray-600 lg:mb-8 lg:w-[95vw]" />
      <div className="container max-w-4xl">
        <nav className="grid-rows-auto grid grid-cols-2 items-start justify-center gap-5 text-center text-sm font-thin text-white lg:grid-cols-2 lg:text-base">
          {/* <div className="col-span-2 col-start-1 row-start-1 flex items-center justify-center gap-[5px] self-center lg:col-span-1 lg:self-start">
            <h1>Powered</h1>
            <h1>By</h1>
            <Link href="https://www.bpm-music.com/">
              <Image
                src={bpmLogo}
                width={65}
                alt="Bpm Logo"
                loading="lazy"
                className="max-w-[55px] lg:max-w-[65px]"
              />
            </Link>
          </div> */}
          <ul className="col-start-1 row-start-2 flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
            <li>
              <h1 className=" mb-1 text-gray-400">Company</h1>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-bpmPink"
              >
                Contact us
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-bpmPink"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-bpmPink"
              >
                Services
              </Link>
            </li>
          </ul>
          <ul className="col-start-2 row-start-2 flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
            <li>
              <h1 className=" mb-1 text-gray-400">Legal</h1>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-bpmPink"
              >
                Terms of Services
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-bpmPink"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
          <div className=" col-span-2 col-start-1 row-start-3 lg:col-span-3 lg:row-start-3">
            <h1 className="mb-5 text-gray-400">Follow us</h1>
            <div className="flex items-center justify-center gap-5 text-2xl text-bpmPink transition-colors duration-200 lg:text-3xl">
              <SocialLinks />
            </div>
          </div>
          <div className="col-span-2 col-start-1 row-start-4 mt-5 lg:col-span-3 lg:row-start-4 lg:self-end">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a href="/" className="underline">
                Spot.
              </a>
              All rights reserved.
            </p>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
