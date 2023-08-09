"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LoadingBar from "@/components/loadingbar";
import Dialog from "@/components/dialog";

function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}

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
      setError("Error, please try again later.");
    } finally {
      setLoading(false);
      setUsername("");
    }
  };

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-12'>
          {loading ? (
            <LoadingBar />
          ) : (
            <>
              <h2 className='text-3xl lg:text-4xl text-white font-thin'>
                <span className='text-bpmPink'>Spot</span> your tracks.
              </h2>
              <form
                className='flex justify-center items-center gap-2'
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
                  className=' w-[50vw] max-w-[250px] min-w-[200px] '
                />
                <Button
                  type='submit'
                  className='bg-bpmPink text-black hover:bg-white duration-200 px-5'
                  disabled={!username}
                >
                  <HiMagnifyingGlass className='text-lg lg:text-xl' />
                </Button>
              </form>
            </>
          )}
          {error && <Dialog message={error} onClick={() => setError(false)} />}
          {searched && (
            <div className='flex flex-col justify-center items-center py-4 px-6 bg-navbarBlack2 rounded-md drop-shadow-lg gap-3 animate-fade-in text-white text-lg lg:text-xl font-thin'>
              {songsData.length === 0 && searched && (
                <h2>No results were found.</h2>
              )}
              {songsData.length !== 0 && (
                <h2>
                  {songsData.length}&nbsp;
                  {songsData.length === 1
                    ? "result was found:"
                    : "results were found:"}
                </h2>
              )}

              {songsData.map((song, index) => (
                <div key={index}>
                  <p>
                    <span className='text-bpmPink'>Title: </span>
                    {capitalizeEveryWord(song.title)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Page;
