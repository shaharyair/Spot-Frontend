"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import BarLoader from "react-spinners/BarLoader";

function Page() {
  const [username, setUsername] = useState("");
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/songs`, {
        params: { username },
      });
      setSongsData(response.data);
    } catch (error) {
      setError("Error fetching songs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='h-screen -mt-28 flex justify-center items-center'>
        <div className='flex justify-center items-center gap-8 text-center m-5'>
          <p className='text-white text-3xl lg:text-4xl'>
            We bring the <span className='text-pinklogo'>Spot</span>, To your
            music.
          </p>
        </div>
      </div>
    </>
  );
}

export default Page;
