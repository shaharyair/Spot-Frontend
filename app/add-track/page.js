"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";

function Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [songTitle, setSongTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [songUploaded, setSongUploaded] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

    setError(null);
    setSongUploaded(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", songTitle);

    axios
      .post("http://127.0.0.1:5000/api/upload_song", formData)
      .then((response) => {
        setSongUploaded(true);
      })
      .catch((error) => {
        setError("Error adding song. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        {!error && loading ? (
          <LoadingBar />
        ) : (
          <form
            className='flex flex-col justify-center items-center gap-8 text-center'
            onSubmit={handleUpload}
          >
            {songUploaded && (
              <h2 className='text-white text-lg lg:text-2xl'>
                Song uploaded successfully!
              </h2>
            )}
            {error && <ErrorMessage message={error} />}
            <Input
              className='w-[90vw] max-w-[300px] min-w-[250px]'
              id='Track'
              type='file'
              onChange={handleFileChange}
              required
            />
            <Input
              className='w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'
              type='text'
              value={songTitle}
              onChange={handleTitleChange}
              placeholder='Title'
            />
            <Button
              type='submit'
              disabled={!selectedFile}
              className='bg-bpmPink text-black hover:bg-white duration-200 '
            >
              Upload Track
            </Button>
          </form>
        )}
      </div>
    </>
  );
}

export default Page;
