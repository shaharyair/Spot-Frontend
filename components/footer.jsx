import Link from "next/link";
import Image from "next/image";
import bpmLogo from "public/bpm-logomain.png";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className='pb-10'>
      <hr className='border-gray-600 w-[90vw] lg:w-[95vw] mx-auto mb-5 lg:mb-8' />
      <div className='container max-w-6xl'>
        <nav className='grid grid-cols-2 grid-rows-auto justify-center items-start text-center text-white font-thin text-sm gap-5 lg:text-base lg:grid-cols-3'>
          <div className='col-start-1 col-span-2 row-start-1 self-center lg:col-span-1 lg:self-start flex justify-center items-center gap-[5px]'>
            <h1>Powered</h1>
            <h1>By</h1>
            <Link href='/'>
              <Image
                src={bpmLogo}
                width={65}
                alt='Bpm Logo'
                loading='lazy'
                className='max-w-[55px] lg:max-w-[65px]'
              />
            </Link>
          </div>
          <ul className='col-start-1 row-start-2 flex flex-col gap-2 lg:col-start-2 lg:row-start-1'>
            <li>
              <h1 className=' text-gray-400 mb-1'>Company</h1>
            </li>
            <li>
              <Link
                href='/'
                className='hover:text-bpmPink transition-colors duration-200'
              >
                Contact us
              </Link>
            </li>
            <li>
              <Link
                href='/'
                className='hover:text-bpmPink transition-colors duration-200'
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href='/'
                className='hover:text-bpmPink transition-colors duration-200'
              >
                Services
              </Link>
            </li>
          </ul>
          <ul className='col-start-2 row-start-2 flex flex-col gap-2 lg:col-start-3 lg:row-start-1'>
            <li>
              <h1 className=' text-gray-400 mb-1'>Legal</h1>
            </li>
            <li>
              <Link
                href='/'
                className='hover:text-bpmPink transition-colors duration-200'
              >
                Terms of Services
              </Link>
            </li>
            <li>
              <Link
                href='/'
                className='hover:text-bpmPink transition-colors duration-200'
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
          <div className=' col-start-1 row-start-3 col-span-2 lg:row-start-3 lg:col-span-3'>
            <h1 className='text-gray-400 mb-5'>Follow us</h1>
            <div className='flex justify-center items-center gap-5 text-2xl lg:text-3xl text-bpmPink transition-colors duration-200'>
              <Link href='/'>
                <FaInstagram className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/'>
                <FaFacebookSquare className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/'>
                <FaYoutube className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/'>
                <FaTiktok className=' hover:text-white transition-colors duration-200' />
              </Link>
            </div>
          </div>
          <div className='row-start-4 col-start-1 col-span-2 mt-5 lg:row-start-4 lg:col-span-3 lg:self-end'>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a href='/' className='underline'>
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
