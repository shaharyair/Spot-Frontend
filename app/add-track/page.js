"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HiMiniArrowUpTray,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import LoadingBar from "@/components/loadingbar";

function Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [songUploaded, setSongUploaded] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleArtistChange = (event) => {
    setSongArtist(event.target.value);
  };

  const handleAlbumChange = (event) => {
    setSongAlbum(event.target.value);
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
    formData.append("artist", songTitle);
    formData.append("album", songTitle);

    axios
      .post("http://127.0.0.1:5000/api/upload_song", formData)
      .then((response) => {
        setSongUploaded(true);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setOptionsOpen(false);
        setSongTitle("");
        setSongArtist("");
        setSongAlbum("");
      });
  };

  return (
    <>
      {songUploaded && (
        <div className='z-[999] fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-dialogBlack/25 backdrop-blur-[3px] animate-fade-in text-center'>
          <div className=' px-10 py-8 lg:px-14 lg:py-10 bg- rounded-lg bg-dialogBlack border border-white flex flex-col items-center justify-center gap-6'>
            <p className=' text-white font-thin text-lg lg:text-xl'>
              Song Uploaded Successfully.
            </p>
            <Button
              className='bg-bpmPink text-black hover:bg-white duration-200'
              onClick={() => setSongUploaded(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {error && (
        <div className='z-[999] fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-dialogBlack/25 backdrop-blur-[3px] animate-fade-in text-center'>
          <div className=' px-10 py-8 lg:px-14 lg:py-10 bg- rounded-lg bg-dialogBlack border border-white flex flex-col items-center justify-center gap-6 leading-3'>
            <p className=' text-white font-thin text-lg lg:text-xl'>
              Error, please try again later.
            </p>
            <Button
              className='bg-bpmPink text-black hover:bg-white duration-200'
              onClick={() => setError(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        {!error && loading ? (
          <LoadingBar />
        ) : (
          <>
            <form
              className='flex flex-col justify-center items-center text-center gap-4'
              onSubmit={handleUpload}
            >
              <h2 className='text-3xl lg:text-4xl mb-8 text-white font-thin'>
                <span className='text-bpmPink'>Upload</span> your tracks.
              </h2>
              <Input
                className='w-[90vw] max-w-[300px] min-w-[250px]'
                id='Track'
                type='file'
                onChange={handleFileChange}
                required
              />

              <div className='grid grid-col-2 justify-center items-center'>
                <div
                  onClick={() => setOptionsOpen(!optionsOpen)}
                  className='text-gray-400 font-thin cursor-pointer flex items-center text-sm lg:text-base gap-1 row-start-1 col-start-1 pl-1'
                >
                  <span className='text-xl lg:text-2xl'>
                    {optionsOpen ? "-" : "+"}
                  </span>
                  More Options
                </div>
                <div className=" className=' text-xl text-gray-600 row-start-1 col-start-2 justify-self-end p-1">
                  <HiOutlineQuestionMarkCircle />
                </div>
                <div
                  className={`${
                    optionsOpen ? "max-h-[500px]" : "max-h-[0px]"
                  } col-span-2 overflow-hidden flex flex-col w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg transition-max-w  duration-300 ease-linear`}
                >
                  <div className='flex flex-col gap-3 py-1'>
                    <Input
                      type='text'
                      value={songTitle}
                      onChange={handleTitleChange}
                      placeholder='Title'
                    />
                    <Input
                      type='text'
                      value={songArtist}
                      onChange={handleArtistChange}
                      placeholder='Artist'
                    />
                    <Input
                      type='text'
                      value={songAlbum}
                      onChange={handleAlbumChange}
                      placeholder='Album'
                    />
                  </div>
                </div>
              </div>
              <Button
                size='lg'
                type='submit'
                disabled={!selectedFile}
                className='bg-bpmPink text-black hover:bg-white duration-200 flex justify-center items-center gap-2'
              >
                Upload
                <HiMiniArrowUpTray className='text-lg lg:text-xl' />
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default Page;
