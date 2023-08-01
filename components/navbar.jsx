"use client";

import React, { useState, useEffect } from "react";
import { HiUser, HiBars3, HiXMark, HiMagnifyingGlass } from "react-icons/hi2";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";
import Link from "next/link";

function Navbar() {
  const [openMobileNavbar, setOpenMobileNavbar] = useState(false);

  const toggleMobileNavbar = () => {
    setOpenMobileNavbar(!openMobileNavbar);
  };

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) {
        setOpenMobileNavbar(false);
      }
    };

    const handleLinkClick = (event) => {
      // Check if the click target is a link or a descendant of a link
      const isLinkClicked = event.target.closest("a");

      // If a link was clicked, close the mobile navbar
      if (isLinkClicked) {
        setOpenMobileNavbar(false);
      }
    };

    const handleOutsideClick = (event) => {
      // Check if the click target is outside the navbar container
      const navbarContainer = document.querySelector(".container");
      if (navbarContainer && !navbarContainer.contains(event.target)) {
        setOpenMobileNavbar(false);
      }
    };

    document.addEventListener("click", handleLinkClick);
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("resize", closeOnResize);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [openMobileNavbar]);

  return (
    <>
      <div
        className='fixed top-0 left-0 flex h-24 w-full items-center justify-center bg-navbarBlack/90
       drop-shadow-lg backdrop-blur-sm'
      >
        <div className='container flex items-center justify-between'>
          <div
            onClick={toggleMobileNavbar}
            className='cursor-pointer lg:hidden text-3xl text-pinklogo'
          >
            {openMobileNavbar ? (
              <HiXMark className='hover:text-white transition-colors duration-200' />
            ) : (
              <HiBars3 className='hover:text-white transition-colors duration-200' />
            )}
          </div>
          <div
            className={`absolute ${
              openMobileNavbar
                ? "left-1/4 md:left-1/2"
                : "-left-3/4 md:-left-1/2"
            } top-24 h-screen w-3/4 md:w-1/2 -translate-x-1/3 md:-translate-x-full transition-mobilenavbar lg:transition-none duration-500 bg-navbarBlack2  px-10 pt-10 lg:static lg:order-2 lg:mr-auto lg:h-auto lg:w-auto lg:translate-x-0 lg:bg-transparent lg:p-0`}
          >
            <nav className='mb-40 lg:m-0'>
              <ul className='flex flex-col items-start justify-center gap-3 text-left text-lg lg:text-xl text-pinklogo lg:flex-row lg:items-center lg:gap-4 lg:text-center'>
                <li>
                  <Link
                    href='/tracks'
                    className='block px-2 py-1 hover:text-white transition-colors duration-200'
                  >
                    Display Tracks
                  </Link>
                </li>
                <li>
                  <Link
                    href='/add-track'
                    className='block px-2 py-1 hover:text-white transition-colors duration-200'
                  >
                    Add Track
                  </Link>
                </li>
                <li>
                  <Link
                    href='/delete-track'
                    className='block px-2 py-1 hover:text-white transition-colors duration-200'
                  >
                    Delete Track
                  </Link>
                </li>
              </ul>
            </nav>
            <Link href='/account' className='inline-block lg:hidden'>
              <div className='mb-10 flex items-center gap-3 text-pinklogo hover:text-white transition-colors duration-200'>
                <HiUser className='text-2xl' />
                <p className='text-lg'>Sign In</p>
              </div>
            </Link>
            <div className='flex gap-4 lg:hidden text-3xl text-pinklogo'>
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
          <Link href='/' className='ml-6 lg:ml-0 lg:mr-10'>
            <h1 className='text-4xl lg:text-5xl font-semibold text-pinklogo'>
              Spot.
            </h1>
          </Link>
          <div className='flex items-center justify-center gap-5 lg:order-3 text-2xl text-pinklogo lg:text-3xl'>
            <Link href='/search'>
              <HiMagnifyingGlass className='hover:text-white transition-colors duration-200' />
            </Link>
            <Link href='/account'>
              <HiUser className='hover:text-white transition-colors duration-200' />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
