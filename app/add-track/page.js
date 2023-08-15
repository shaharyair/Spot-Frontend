"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HiMiniArrowUpTray,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import LoadingBar from "@/components/loadingbar";
import Dialog from "@/components/dialog";
import Tooltip from "@/components/tooltip";

// Main component definition
function Page() {
  // State variables to manage form inputs, loading state, and error messages
  const [songs, setSongs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileNameNoExtension, setFileNameNoExtension] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [songUploaded, setSongUploaded] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [trackExists, setTrackExists] = useState(false);
  const [userEditedTitle, setUserEditedTitle] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  // Regular expression pattern and error message for text validation
  const regexPatternString = "^.{1,50}$";
  const regexMessage = "Please enter a maximum length of 50 characters.";

  // Validation function for text inputs
  const isValidText = (text) => {
    const regexPattern = new RegExp(regexPatternString);
    return regexPattern.test(text);
  };

  // Handler for file input change
  const handleFileChange = (event) => {
    // Update selected file and related state variables
    const newFile = event.target.files[0];
    setSelectedFile(newFile);
    setUserEditedTitle(false);
    const fileName = newFile && newFile.name.replace(/\.[^/.]+$/, "");
    setFileNameNoExtension(fileName);

    // Check if the filename already exists in the database if title not edited by user
    const noTitlefileNameExists =
      fileName &&
      !songTitle &&
      songs.some((song) => song.title.toLowerCase() === fileName.toLowerCase());
    setTrackExists(noTitlefileNameExists);
  };

  // Handler for song title change
  const handleTitleChange = (event) => {
    // Update song title and check if it already exists
    const newTitle = event.target.value;
    setSongTitle(newTitle);
    setUserEditedTitle(true);

    // Check if the title already exists in the database if title edited by user
    const titleExists = songs.some(
      (song) => song.title.toLowerCase() === newTitle.toLowerCase()
    );
    setTrackExists(titleExists);
  };

  // Handlers for artist and album input changes
  const handleArtistChange = (event) => {
    setSongArtist(event.target.value);
  };

  const handleAlbumChange = (event) => {
    setSongAlbum(event.target.value);
  };

  // Handler for the upload button
  const handleUpload = async (event) => {
    event.preventDefault();

    // Start loading state
    setLoading(true);

    // Validation checks for form inputs
    if (!selectedFile) {
      setError("Please select a file.");
      setLoading(false);
      return;
    }

    if (
      (fileNameNoExtension && !isValidText(fileNameNoExtension)) ||
      (songTitle && !isValidText(songTitle)) ||
      (songArtist && !isValidText(songArtist)) ||
      (songAlbum && !isValidText(songAlbum))
    ) {
      setError(regexMessage);
      setLoading(false);
      return;
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", songTitle || fileNameNoExtension);
    formData.append("artist", songArtist);
    formData.append("album", songAlbum);

    try {
      // Check if the song with the same title or filename already exists
      const songsResponse = await axios.get(
        "http://127.0.0.1:5000/api/database_songs"
      );
      const songs = songsResponse.data;

      const noTitlefileNameExists =
        !songTitle &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === fileNameNoExtension.toLowerCase()
        );

      const titleExists = songs.some(
        (song) => song.title.toLowerCase() === songTitle.toLowerCase()
      );

      if (titleExists || noTitlefileNameExists) {
        setError("A track with the same title already exists.");
      } else {
        // Upload the song if the title doesn't exist
        await axios.post("http://127.0.0.1:5000/api/upload_song", formData);
        setSongUploaded("Track uploaded successfully.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      // Reset state after upload attempt
      setUploadCount((prevCount) => prevCount + 1);
      setLoading(false);
      setOptionsOpen(false);
      setFileNameNoExtension("");
      setSongTitle("");
      setSongArtist("");
      setSongAlbum("");
      setSelectedFile(null);
    }
  };

  // Fetch songs data from the server when uploadCount changes
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/database_songs`)
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setError(error.message);
      });
  }, [uploadCount]);

  // Render the component UI
  return (
    <>
      {/* Display success or error dialogs */}
      {songUploaded && (
        <Dialog message={songUploaded} onClick={() => setSongUploaded(false)} />
      )}
      {error && <Dialog message={error} onClick={() => setError(false)} />}
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        {!error && loading ? (
          // Display loading bar
          <LoadingBar />
        ) : (
          // Display upload form
          <>
            <form
              className='flex flex-col justify-center items-center text-center gap-4'
              onSubmit={handleUpload}
            >
              {/* Form header */}
              <h2 className='text-3xl lg:text-4xl mb-8 text-white font-thin'>
                <span className='text-bpmPink'>Upload</span> your tracks.
              </h2>
              {/* File input */}
              <Input
                className={`w-[90vw] max-w-[300px] min-w-[250px]  ${
                  trackExists && "border-2 border-red-500 text-red-800"
                }`}
                id='Track'
                type='file'
                onChange={handleFileChange}
                required
              />
              {/* Track exists message */}
              {trackExists && (
                <p className='text-red-800'>
                  A track with the same title already exists.
                </p>
              )}
              {/* More Options section */}
              <div className='grid grid-col-2 justify-center items-center'>
                {/* Toggle More Options */}
                <div
                  onClick={() => setOptionsOpen(!optionsOpen)}
                  className='text-gray-400 font-thin cursor-pointer flex items-center text-sm lg:text-base gap-1 row-start-1 col-start-1 pl-1'
                >
                  <span className='text-lg lg:text-lg'>
                    {optionsOpen ? "-" : "+"}
                  </span>
                  More Options
                </div>
                {/* Tooltip */}
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

                {/* More Options content */}
                <div
                  className={`${
                    optionsOpen ? "max-h-[500px]" : "max-h-[0px]"
                  } col-span-2 overflow-hidden flex flex-col w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg transition-max-w  duration-300 ease-linear`}
                >
                  <div className='flex flex-col gap-3 p-1'>
                    {/* Title input */}
                    <Input
                      type='text'
                      value={userEditedTitle ? songTitle : fileNameNoExtension}
                      onChange={handleTitleChange}
                      placeholder='Title'
                      pattern={regexPatternString}
                      title={regexMessage}
                      className={
                        trackExists && "border-2 border-red-500 text-red-800"
                      }
                    />
                    {/* Artist input */}
                    <Input
                      type='text'
                      value={songArtist}
                      onChange={handleArtistChange}
                      placeholder='Artist'
                      pattern={regexPatternString}
                      title={regexMessage}
                    />
                    {/* Album input */}
                    <Input
                      type='text'
                      value={songAlbum}
                      onChange={handleAlbumChange}
                      placeholder='Album'
                      pattern={regexPatternString}
                      title={regexMessage}
                    />
                  </div>
                </div>
              </div>
              {/* Upload button */}
              <Button
                size='lg'
                type='submit'
                disabled={!selectedFile || trackExists}
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

// Export the component
export default Page;
