"use client";

import React, { useState, useEffect, useRef } from "react";
import { Fade as Hamburger } from "hamburger-react";
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
  const navbarContainerRef = useRef(null);

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
      if (
        navbarContainerRef.current &&
        !navbarContainerRef.current.contains(event.target)
      ) {
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
        className="fixed left-0 top-0 z-50 flex h-navbarHeight w-full items-center justify-center
       bg-navbarBlack/90 drop-shadow-lg backdrop-blur-sm"
      >
        <div
          ref={navbarContainerRef}
          className="container flex w-11/12 items-center justify-between p-0"
        >
          <div className="text-bpmPink hover:text-white lg:hidden">
            <Hamburger
              direction="right"
              toggled={openMobileNavbar}
              toggle={toggleMobileNavbar}
              rounded
              size={20}
              duration={0.2}
            />
          </div>
          <div
            className={`absolute ${
              openMobileNavbar
                ? "left-1/4 md:left-1/2"
                : "-left-3/4 md:-left-1/2"
            } transition-mobilenavbar top-24 flex h-screen w-3/4 -translate-x-1/3 flex-col items-start justify-start bg-navbarBlack2 px-10 pt-10 duration-200 md:w-1/2  md:-translate-x-full lg:static lg:order-2 lg:mr-auto lg:h-auto lg:w-auto lg:translate-x-0 lg:bg-transparent lg:p-0 lg:transition-none`}
          >
            <nav>
              <ul className="flex flex-col items-start justify-center gap-3 text-left text-sm text-bpmPink lg:flex-row lg:items-center lg:gap-5 lg:text-center lg:text-base">
                <li>
                  <Link
                    href="/"
                    className="block p-0 transition-colors duration-200 hover:text-white lg:px-2 lg:py-1"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block p-0 transition-colors duration-200 hover:text-white lg:px-2 lg:py-1"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block p-0 transition-colors duration-200 hover:text-white lg:px-2 lg:py-1"
                  >
                    Services
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="my-10 flex flex-col items-start justify-center gap-3 text-lg text-bpmPink lg:hidden">
              <Link
                href="/tracks"
                className="flex items-center justify-center gap-2 text-xl transition-colors duration-200 hover:text-white"
              >
                <HiListBullet />
                <span className="text-sm">Tracks</span>
              </Link>
              <Link
                href="/add-track"
                className="flex items-center justify-center gap-2 text-xl transition-colors duration-200 hover:text-white"
              >
                <HiMiniArrowUpTray />
                <span className="text-sm">Upload Track</span>
              </Link>
              <Link
                href="/delete-track"
                className="flex items-center justify-center gap-2 text-xl transition-colors duration-200 hover:text-white"
              >
                <HiTrash />
                <span className="text-sm">Delete Track</span>
              </Link>
            </div>
            <div className="flex flex-row items-center gap-3 text-sm text-bpmPink transition-colors duration-200 hover:text-white lg:hidden">
              <Link
                href="/account"
                className="flex items-center justify-center gap-2 text-xl transition-colors duration-200 hover:text-white"
              >
                <HiUser />
                <span className="text-sm">Account</span>
              </Link>
            </div>
            <div className="my-10 flex gap-4 text-2xl text-bpmPink lg:hidden">
              <SocialLinks />
            </div>
          </div>
          <Link href="/" className="ml-1.5 lg:ml-0 lg:mr-20">
            <h1 className="text-4xl font-semibold text-bpmPink lg:text-5xl">
              Spot.
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-5 text-2xl text-bpmPink lg:order-3">
            <div className="hidden items-center justify-center gap-5 text-2xl text-bpmPink lg:flex">
              <Link href="/tracks">
                <HiListBullet className=" text-3xl transition-colors duration-200 hover:text-white" />
              </Link>
              <Link href="/add-track">
                <HiMiniArrowUpTray className=" transition-colors duration-200 hover:text-white" />
              </Link>
              <Link href="/delete-track">
                <HiTrash className=" transition-colors duration-200 hover:text-white" />
              </Link>
              <Link href="/account">
                <HiUser className="transition-colors duration-200 hover:text-white" />
              </Link>
            </div>
            <Link href="/search">
              <Button className="hidden items-center justify-center gap-2 rounded-xl bg-bpmPink p-4 text-black duration-200 hover:bg-white lg:ml-2 lg:flex">
                Search <HiMagnifyingGlass className="text-lg" />
              </Button>
              <HiMagnifyingGlass className="p-3 text-5xl transition-colors duration-200 hover:text-white lg:hidden" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
