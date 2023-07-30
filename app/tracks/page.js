"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BarLoader } from "react-spinners";

function ErrorMessage({ message }) {
  return (
    <div className='bg-red-200 p-4 rounded-lg'>
      <p className='text-red-700 text-lg lg:text-xl'>{message}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <BarLoader
      color='#E900FF'
      cssOverride={{
        width: "30vw",
        maxWidth: "350px",
        minWidth: "250px",
      }}
    />
  );
}

function SongList({ songs }) {
  return (
    <>
      {songs.length === 0 ? null : (
        <>
          <h2 className='text-white text-3xl lg:text-4xl'>Tracks:</h2>
          <ul>
            {songs.map((song) => (
              <li key={song.title} className='m-2'>
                <p className='text-white md:text-md lg:text-lg'>
                  <span className='text-pinklogo'>Title: </span>
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
      <div className='h-screen -mt-28 flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center m-5'>
          {error && <ErrorMessage message={error} />}
          {loading ? <LoadingSpinner /> : <SongList songs={songs} />}
        </div>
      </div>
    </>
  );
}

export default Page;
