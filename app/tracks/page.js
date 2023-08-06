"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";

function SongList({ songs }) {
  return (
    <>
      {songs.length !== 0 && (
        <>
          <h2 className='text-bpmPink text-3xl lg:text-4xl'>Tracks:</h2>
          <ul className='flex flex-col justify-center items-start gap-2 text-left'>
            {songs.map((song, index) => (
              <li
                key={index}
                className='flex justify-center items-center gap-2'
              >
                <p className='text-white md:text-md lg:text-lg'>
                  <span className='text-bpmPink'>Title: </span>
                  {song.title}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function Page() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/database_songs`)
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setLoading(false);
        setError("Error fetching songs. Please try again later.");
      });
  }, []);

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center'>
          {error && <ErrorMessage message={error} />}
          {!error && (loading ? <LoadingBar /> : <SongList songs={songs} />)}
        </div>
      </div>
    </>
  );
}

export default Page;
