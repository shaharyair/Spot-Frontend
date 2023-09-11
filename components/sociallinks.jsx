import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebookSquare,
  FaSoundcloud,
} from "react-icons/fa";
import Link from "next/link";

function SocialLinks() {
  return (
    <>
      <Link href='https://www.instagram.com/bpmcollege/'>
        <FaInstagram className=' hover:text-white transition-colors duration-200' />
      </Link>
      <Link href='https://www.facebook.com/BPM.College'>
        <FaFacebookSquare className=' hover:text-white transition-colors duration-200' />
      </Link>
      <Link href='https://www.youtube.com/user/BPMcollege'>
        <FaYoutube className=' hover:text-white transition-colors duration-200' />
      </Link>
      <Link href='https://www.tiktok.com/@bpm_college1'>
        <FaTiktok className=' hover:text-white transition-colors duration-200' />
      </Link>
      <Link href='https://soundcloud.com/bpmsoundschool'>
        <FaSoundcloud className=' hover:text-white transition-colors duration-200' />
      </Link>
    </>
  );
}

export default SocialLinks;
