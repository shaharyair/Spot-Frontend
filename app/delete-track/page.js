"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Page() {
  const [songTitle, setSongTitle] = useState("");

  const handleTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    if (!songTitle.trim()) {
      alert("Please enter a song title.");
      return;
    }

    axios
      .post("http://127.0.0.1:5000/api/delete_song", { title: songTitle })
      .then((response) => {
        console.log("Song deleted successfully!");
        alert("Song deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete the song.", error);
        alert("Failed to delete the song!");
      });
  };

  return (
    <>
      <div className='h-screen -mt-28 flex justify-center items-center'>
        <form
          className='flex flex-col justify-center items-center gap-8 text-center m-5'
          onSubmit={handleDelete}
        >
          <Input
            className='w-[50vw] max-w-[300px] min-w-[150px] text-md lg:text-lg'
            type='text'
            value={songTitle}
            onChange={handleTitleChange}
            placeholder='Track Title'
            required
          />
          <Button
            type='submit'
            className='bg-pinklogo text-black hover:bg-white duration-200 '
          >
            Delete Track
          </Button>
        </form>
      </div>
    </>
  );
}

export default Page;
