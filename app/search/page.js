"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";

function Page() {
  const [username, setUsername] = useState("");
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSearched(false);
    setSongsData([]);
    setError(null);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/songs`, {
        params: { username },
      });
      setSongsData(response.data);
      setSearched(true);
    } catch (error) {
      setError("Error fetching songs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center p-2'>
        <div className='flex flex-col justify-center items-center'>
          <h2 className='text-3xl lg:text-4xl text-white'>
            <span className='text-pinklogo'>Spot</span> your tracks.
          </h2>
          <form
            className='flex justify-center items-center gap-2 my-12 lg:my-14'
            onSubmit={handleSubmit}
          >
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={handleUsernameChange}
              pattern='^[a-zA-Z][a-zA-Z0-9._]{1,29}$'
              title='Username must start with a letter and can only contain letters, numbers, periods, and underscores.'
              required
              className=' w-[50vw] max-w-[300px] min-w-[150px] text-sm lg:text-lg '
            />
            <Button
              type='submit'
              className='bg-pinklogo hover:bg-white duration-200'
            >
              <HiMagnifyingGlass className='text-black text-2xl' />
            </Button>
          </form>
          {loading && <LoadingBar />}
          {error && <ErrorMessage message={error} />}
          {songsData.length === 0 && searched && (
            <h2 className='text-white mb-4 text-lg lg:text-2xl'>
              No results were found.
            </h2>
          )}
          {songsData.length !== 0 && (
            <h2 className='text-white mb-4 text-lg lg:text-2xl'>
              {songsData.length}&nbsp;
              {songsData.length === 1
                ? "result was found:"
                : "results were found:"}
            </h2>
          )}

          {songsData.map((song, index) => (
            <div key={index} className='text-white mb-1 text-lg lg:text-xl'>
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
