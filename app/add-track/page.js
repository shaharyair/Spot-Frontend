"use client";

import axios from "axios";
import { useState, useEffect } from "react";

import { API_BASE_URL, ENDPOINTS } from "@/config";

import LoadingBar from "@/components/loadingbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HiMiniArrowUpTray,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import Dialog from "@/components/dialog";
import Tooltip from "@/components/tooltip";

// Main component definition
function Page() {
  // songs array, upload count to update songs with useEffect
  const [songs, setSongs] = useState([]);
  const [uploadCount, setUploadCount] = useState(0);

  // form values and options menu states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);

  // open dialog messages states
  const [songUploaded, setSongUploaded] = useState("");
  const [error, setError] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  // error handling states
  const [trackExists, setTracksExists] = useState(false);
  const [userEditedTitle, setUserEditedTitle] = useState(false);
  const [artistsByFilename, setArtistsByFilename] = useState("");
  const [artistsBySongtitle, setartistsBySongtitle] = useState("");

  // Regular expression pattern and error message for text validation
  const regexPatternString = "^.{1,75}$";
  const regexMessage = "Please enter a maximum length of 75 characters.";

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

    // get filename without the extension
    const fileNameWithoutExtension =
      newFile && newFile.name.replace(/\.[^/.]+$/, "");

    // checking the artist names that has the same fileName
    const selectedSongsByFilename =
      fileNameWithoutExtension &&
      songs.filter(
        (song) =>
          fileNameWithoutExtension.toLowerCase() === song.title.toLowerCase()
      );

    const matchingArtists =
      selectedSongsByFilename &&
      selectedSongsByFilename.map((song) => song.artist).join(", ");

    setArtistsByFilename(matchingArtists);

    // false if user didnt edit the title, title value will be the filename
    setUserEditedTitle(false);

    // Check if the filename already exists in the database if title not edited by user
    const titleExists =
      fileNameWithoutExtension &&
      !songTitle &&
      songs.some(
        (song) =>
          song.title.toLowerCase() === fileNameWithoutExtension.toLowerCase()
      );
    setTracksExists(titleExists);

    // reset artist, title, album to an empty string / filename is set if there is a newfile
    setSongArtist("");
    setSongTitle("");
    setSongAlbum("");
    setFileName(newFile ? fileNameWithoutExtension : "");
    setOptionsOpen(true);
  };

  // Handler for song title change
  const handleTitleChange = (event) => {
    // Update song title and check if it already exists
    const newTitle = event.target.value;
    setSongTitle(newTitle);

    // checking the artist names that has the same songTitle
    const selectedSongsBySongtitle =
      newTitle &&
      songs.filter(
        (song) => newTitle.toLowerCase() === song.title.toLowerCase()
      );

    const matchingArtists =
      selectedSongsBySongtitle &&
      selectedSongsBySongtitle.map((song) => song.artist).join(", ");

    setartistsBySongtitle(matchingArtists);

    // true if user edited the title, title value will be the songTitle
    setUserEditedTitle(true);

    // Check if the title already exists in the database if title edited by user
    const titleExists =
      (newTitle &&
        !songArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === newTitle.toLowerCase()
        )) ||
      (fileName &&
        !newTitle &&
        !songArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === fileName.toLowerCase()
        )) ||
      (newTitle &&
        songArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === newTitle.toLowerCase() &&
            song.artist.toLowerCase() === songArtist.toLowerCase()
        )) ||
      (!newTitle &&
        fileName &&
        songArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === fileName.toLowerCase() &&
            song.artist.toLowerCase() === songArtist.toLowerCase()
        ));
    setTracksExists(titleExists);
  };

  // Handlers for artist and album input changes
  const handleArtistChange = (event) => {
    const newArtist = event.target.value;
    setSongArtist(newArtist);

    const artistExists =
      (songTitle &&
        newArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === songTitle.toLowerCase() &&
            song.artist.toLowerCase() === newArtist.toLowerCase()
        )) ||
      (songTitle &&
        !newArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === songTitle.toLowerCase()
        )) ||
      (fileName &&
        newArtist &&
        !songTitle &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === fileName.toLowerCase() &&
            song.artist.toLowerCase() === newArtist.toLowerCase()
        )) ||
      (fileName &&
        !newArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === fileName.toLowerCase()
        ));
    setTracksExists(artistExists);
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

    if (!songArtist) {
      setError("Please add the track artist.");
      setLoading(false);
      return;
    }

    if (
      (fileName && !isValidText(fileName)) ||
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
    formData.append("title", songTitle || fileName);
    formData.append("artist", songArtist);
    formData.append("album", songAlbum);

    try {
      // Check if the song with the same title or artist already exists
      if (trackExists) {
        setError("A track with the same title and artist already exists.");
      } else {
        // Upload the song if the title doesn't exist
        await axios.post(`${API_BASE_URL}${ENDPOINTS.upload_song}`, formData);
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
      setTracksExists(false);
      setFileName("");
      setSongTitle("");
      setSongArtist("");
      setSongAlbum("");
      setSelectedFile(null);
    }
  };

  // Fetch songs data from the server when uploadCount changes
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${ENDPOINTS.database_songs}`)
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setError(error.message);
      });
  }, [uploadCount]);

  // UseEffect to set OptionsOpen when trackExists changes
  useEffect(() => {
    if (trackExists) {
      setOptionsOpen(true);
    }
  }, [trackExists]);

  // Render the component UI
  return (
    <>
      {/* Display success or error dialogs */}
      {songUploaded && (
        <Dialog message={songUploaded} onClick={() => setSongUploaded(false)} />
      )}
      {error && <Dialog message={error} onClick={() => setError(false)} />}
      <div className='container mt-24 min-h-[87dvh] flex flex-col justify-center items-center'>
        {!error && loading ? (
          // Display loading bar
          <LoadingBar />
        ) : (
          // Display upload form
          <>
            <form
              className='flex flex-col justify-center items-center text-center gap-4 p-10'
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
              {/* Title exists message */}
              {trackExists && (
                <div className='text-red-800'>
                  <p>
                    This track title is already taken by&nbsp;
                    <span className='text-white'>
                      {`${artistsBySongtitle || artistsByFilename}`}
                    </span>
                    <br />
                    Please choose a different title or artist.
                  </p>
                </div>
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
                      value={userEditedTitle ? songTitle : fileName}
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
                      placeholder='Artist (Required)'
                      pattern={regexPatternString}
                      title={regexMessage}
                      className={
                        trackExists && "border-2 border-red-500 text-red-800"
                      }
                      required
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
                disabled={!selectedFile || trackExists || !songArtist}
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
