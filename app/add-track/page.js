"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Page() {
  // const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [songTitle, setSongTitle] = useState("");

  const handleFileChange = (event) => {
    // setSelectedFile(event.target.files[0]);
    setSelectedFile(event.target.value);
  };

  const handleTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    if (!songTitle.trim()) {
      alert("Please enter a song title.");
      return;
    }

    // Upload mp3 file to the database
    // const formData = new FormData();
    // formData.append("track_path", selectedFile);
    // formData.append("title", songTitle);

    // Upload with track path
    const formData = {
      track_path: selectedFile,
      title: songTitle,
    };

    axios
      .post("http://127.0.0.1:5000/api/upload_song", formData)
      .then((response) => {
        console.log("Song uploaded successfully!");
        alert("Song uploaded successfully!");
      })
      .catch((error) => {
        console.error("Failed to upload the song.", error);
        alert("Failed to upload the song.");
      });
  };

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center p-2'>
        <form
          className='flex flex-col justify-center items-center gap-8 text-center'
          onSubmit={handleUpload}
        >
          <Input
            // className='w-[50vw] max-w-[300px] min-w-[150px]'
            className='w-[50vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'
            id='Track'
            // type='file'
            type='text'
            value={selectedFile}
            onChange={handleFileChange}
            placeholder='Track Path'
            required
          />
          <Input
            className='w-[50vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'
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
            Upload Track
          </Button>
        </form>
      </div>
    </>
  );
}

export default Page;
