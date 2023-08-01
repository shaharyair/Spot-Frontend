import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className='pb-10'>
      <hr className='border-gray-600 w-[85vw] lg:w-[95vw] mx-auto mb-7' />
      <div className='container'>
        <nav className='grid grid-cols-2 grid-rows-auto justify-center items-start text-center text-white font-medium text-sm gap-y-7 gap-x-1'>
          <Link
            href='/'
            className='col-start-1 col-span-2 row-start-1 self-center'
          >
            <h1 className='text-3xl lg:text-4xl font-semibold text-pinklogo'>
              Spot.
            </h1>
          </Link>
          <ul className='col-start-1 row-start-2 flex flex-col gap-2'>
            <li>
              <h1 className=' text-gray-400 mb-1'>Company</h1>
            </li>
            <li>
              <Link href='/'>
                <p className='hover:text-pinklogo transition-colors duration-200'>
                  Contact us
                </p>
              </Link>
            </li>
            <li>
              <Link href='/'>
                <p className='hover:text-pinklogo transition-colors duration-200'>
                  About
                </p>
              </Link>
            </li>
            <li>
              <Link href='/'>
                <p className='hover:text-pinklogo transition-colors duration-200'>
                  Services
                </p>
              </Link>
            </li>
          </ul>
          <ul className='col-start-2 row-start-2 flex flex-col gap-2'>
            <li>
              <h1 className=' text-gray-400 mb-1'>Legal</h1>
            </li>
            <li>
              <Link href='/'>
                <p className='hover:text-pinklogo transition-colors duration-200'>
                  Terms of Services
                </p>
              </Link>
            </li>
            <li>
              <Link href='/'>
                <p className='hover:text-pinklogo transition-colors duration-200'>
                  Privacy Policy
                </p>
              </Link>
            </li>
          </ul>
          <div className=' col-start-1 col-span-2 row-start-3'>
            <h1 className='text-gray-400 mb-4'>Follow us</h1>
            <div className='flex justify-center items-center gap-6 text-3xl text-pinklogo transition-colors duration-200'>
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
          <div className='row-start-4 col-span-2 mt-5'>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a href='/' className='underline'>
                Spot.
              </a>{" "}
              All rights reserved.
            </p>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
