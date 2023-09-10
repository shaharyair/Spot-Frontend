"use client";

import React, { useState, useEffect } from "react";
import { Squash as Hamburger } from "hamburger-react";
import {
  HiUser,
  HiBars3,
  HiXMark,
  HiMagnifyingGlass,
  HiMiniArrowUpTray,
  HiTrash,
  HiListBullet,
} from "react-icons/hi2";
import Link from "next/link";
import { Button } from "./ui/button";
import SocialLinks from "./sociallinks";

function Navbar() {
  const [openMobileNavbar, setOpenMobileNavbar] = useState(false);

  const toggleMobileNavbar = () => {
    setOpenMobileNavbar(!openMobileNavbar);
  };

  useEffect(() => {
    const closeMobileNavbarOnResize = () => {
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
    window.addEventListener("resize", closeMobileNavbarOnResize);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("resize", closeMobileNavbarOnResize);
    };
  }, [openMobileNavbar]);

  return (
    <>
      <div
        className='fixed top-0 left-0 flex h-24 w-full items-center justify-center bg-navbarBlack/90
       drop-shadow-lg backdrop-blur-sm z-50'
      >
        <div className='container flex items-center justify-between'>
          <div className='text-bpmPink lg:hidden'>
            <Hamburger
              toggled={openMobileNavbar}
              toggle={toggleMobileNavbar}
              rounded
              size={23}
            />
          </div>
          <div
            className={`absolute ${
              openMobileNavbar
                ? "left-1/4 md:left-1/2"
                : "-left-3/4 md:-left-1/2"
            } flex flex-col items-start justify-start top-24 h-screen w-3/4 md:w-1/2 -translate-x-1/3 md:-translate-x-full transition-mobilenavbar lg:transition-none duration-500 bg-navbarBlack2  px-10 pt-10 lg:static lg:order-2 lg:mr-auto lg:h-auto lg:w-auto lg:translate-x-0 lg:bg-transparent lg:p-0`}
          >
            <nav>
              <ul className='flex flex-col items-start justify-center gap-3 text-left text-sm lg:text-base text-bpmPink lg:flex-row lg:items-center lg:gap-5 lg:text-center'>
                <li>
                  <Link
                    href='/'
                    className='block p-0 lg:px-2 lg:py-1 hover:text-white transition-colors duration-200'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href='/'
                    className='block p-0 lg:px-2 lg:py-1 hover:text-white transition-colors duration-200'
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href='/'
                    className='block p-0 lg:px-2 lg:py-1 hover:text-white transition-colors duration-200'
                  >
                    Services
                  </Link>
                </li>
              </ul>
            </nav>
            <div className='lg:hidden flex flex-col items-start justify-center gap-3 my-10 text-bpmPink text-lg'>
              <Link
                href='/tracks'
                className='flex justify-center items-center gap-2 hover:text-white transition-colors duration-200 text-xl'
              >
                <HiListBullet />
                <span className='text-sm'>Tracks</span>
              </Link>
              <Link
                href='/add-track'
                className='flex justify-center items-center gap-2 hover:text-white transition-colors duration-200 text-xl'
              >
                <HiMiniArrowUpTray />
                <span className='text-sm'>Upload Track</span>
              </Link>
              <Link
                href='/delete-track'
                className='flex justify-center items-center gap-2 hover:text-white transition-colors duration-200 text-xl'
              >
                <HiTrash />
                <span className='text-sm'>Delete Track</span>
              </Link>
            </div>
            <div className='flex flex-row items-center gap-3 text-bpmPink hover:text-white transition-colors duration-200 text-sm lg:hidden'>
              <Link
                href='/'
                className='flex justify-center items-center gap-2 hover:text-white transition-colors duration-200 text-xl'
              >
                <HiUser />
                <span className='text-sm'>Sign In</span>
              </Link>
            </div>
            <div className='flex gap-4 lg:hidden text-2xl text-bpmPink my-10'>
              <SocialLinks />
            </div>
          </div>
          <Link href='/' className='lg:mr-20'>
            <h1 className='text-4xl lg:text-5xl font-semibold text-bpmPink'>
              Spot.
            </h1>
          </Link>
          <div className='flex items-center justify-center gap-5 lg:order-3 text-bpmPink text-2xl'>
            <div className='lg:flex items-center justify-center gap-5 text-bpmPink text-2xl hidden'>
              <Link href='/tracks'>
                <HiListBullet className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/add-track'>
                <HiMiniArrowUpTray className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/delete-track'>
                <HiTrash className=' hover:text-white transition-colors duration-200' />
              </Link>
              <Link href='/'>
                <HiUser className='hover:text-white transition-colors duration-200' />
              </Link>
            </div>
            <Link href='/search'>
              <Button className='bg-bpmPink text-black hover:bg-white duration-200 rounded-xl justify-center hidden p-4 items-center gap-2 lg:flex lg:ml-2'>
                Search <HiMagnifyingGlass className='text-lg' />
              </Button>
              <HiMagnifyingGlass className='lg:hidden hover:text-white transition-colors duration-200' />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
