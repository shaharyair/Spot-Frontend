"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function Page() {
  const [username, setUsername] = useState("");
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async () => {
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
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center m-10'>
          <h1 className='text-5xl font-semibold text-pinklogo'>Spot.</h1>
          <div className='flex justify-center items-center gap-2 my-16'>
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={handleUsernameChange}
              pattern='^[a-zA-Z][a-zA-Z0-9._]{1,29}$'
              title='Username must start with a letter and can only contain letters, numbers, periods, and underscores.'
            />
            <Button
              type='submit'
              onClick={handleSubmit}
              className='bg-pinklogo hover:bg-white'
            >
              <Search className='text-black' />
            </Button>
          </div>
          {loading && <p className='text-white mb-4 text-lg'>Loading...</p>}
          {error && <p className='text-red-500 mb-4 text-lg'>{error}</p>}
          {songsData.length !== 0 && (
            <h2 className='text-white mb-4 text-lg'>
              {songsData.length} results were found:
            </h2>
          )}
          {songsData.map((song) => (
            <div key={song.id} className='text-white mb-1'>
              <p>
                <span className='text-pinklogo font-semibold'>Title: </span>
                {song.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Page;
