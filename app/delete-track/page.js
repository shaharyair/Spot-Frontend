"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";

function SongListDeleteForm({ songs }) {
  const [songTitle, setSongTitle] = useState("");

  const handleRadioChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    if (!songTitle.trim()) {
      alert("Please choose a song title.");
      return;
    }

    axios
      .post("http://127.0.0.1:5000/api/delete_song", { title: songTitle })
      .then((response) => {
        console.log("Song deleted successfully!");
        alert("Song deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Failed to delete the song.", error);
        alert("Failed to delete the song!");
      });
  };

  return (
    <>
      <form
        className='flex flex-col justify-center items-center gap-8 text-center'
        onSubmit={handleDelete}
      >
        <h2 className='text-bpmPink text-3xl lg:text-4xl'>Tracks:</h2>
        <ul className='flex flex-col justify-center items-start gap-2 text-left'>
          {songs.map((song, index) => (
            <li key={index} className='flex justify-center items-center gap-2'>
              <input
                id={song.title}
                type='radio'
                value={song.title}
                checked={songTitle === song.title}
                onChange={handleRadioChange}
                className='h-4 w-4'
              />
              <Label
                htmlFor={song.title}
                className='text-white md:text-md lg:text-lg leading-5'
              >
                {song.title}
              </Label>
            </li>
          ))}
        </ul>
        <Button
          disabled={!songTitle}
          type='submit'
          className='bg-bpmPink text-black hover:bg-white duration-200 '
        >
          Delete Track
        </Button>
      </form>
    </>
  );
}

function Page() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

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
          {!error &&
            (loading ? <LoadingBar /> : <SongListDeleteForm songs={songs} />)}
        </div>
      </div>
    </>
  );
}

export default Page;
