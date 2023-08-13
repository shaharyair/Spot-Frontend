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
import Dialog from "@/components/dialog";
import Tooltip from "@/components/tooltip";

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
    formData.append("artist", songArtist);
    formData.append("album", songAlbum);

    axios
      .post("http://127.0.0.1:5000/api/upload_song", formData)
      .then((response) => {
        setSongUploaded(true);
      })
      .catch((error) => {
        setError(true);
        setSelectedFile(null);
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
        <Dialog
          message={"Song Uploaded Successfully."}
          onClick={() => setSongUploaded(false)}
        />
      )}
      {error && (
        <Dialog
          message={"Error, please try again later."}
          onClick={() => setError(false)}
        />
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
                  <span className='text-lg lg:text-lg'>
                    {optionsOpen ? "-" : "+"}
                  </span>
                  More Options
                </div>
                <Tooltip
                  childrenStyle={
                    "text-2xl text-gray-600 row-start-1 col-start-2 justify-self-end p-1"
                  }
                  message={"Audio file (WAV, MP3, AIFC, etc)"}
                  position={"bottom"}
                  variant={"dark"}
                >
                  <HiOutlineQuestionMarkCircle />
                </Tooltip>

                <div
                  className={`${
                    optionsOpen ? "max-h-[500px]" : "max-h-[0px]"
                  } col-span-2 overflow-hidden flex flex-col w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg transition-max-w  duration-300 ease-linear`}
                >
                  <div className='flex flex-col gap-3 p-1'>
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
