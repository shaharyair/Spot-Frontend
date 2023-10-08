"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "@/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HiMiniArrowUpTray,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import Tooltip from "@/components/tooltip";

export default function UploadTrackForm({
  songs,
  setUploadCount,
  setLoading,
  setError,
  setSongUploaded,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [trackExists, setTracksExists] = useState(false);
  const [userEditedTitle, setUserEditedTitle] = useState(false);
  const [artistsByFilename, setArtistsByFilename] = useState("");
  const [artistsBySongtitle, setArtistsBySongtitle] = useState("");
  const regexPatternString = "^.{1,75}$";
  const regexMessage = "Please enter a maximum length of 75 characters.";

  const isValidText = (text) => {
    const regexPattern = new RegExp(regexPatternString);
    return regexPattern.test(text);
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setSelectedFile(newFile);
    const fileNameWithoutExtension =
      newFile && newFile.name.replace(/\.[^/.]+$/, "");
    const selectedSongsByFilename =
      fileNameWithoutExtension &&
      songs.filter(
        (song) =>
          fileNameWithoutExtension.toLowerCase() === song.title.toLowerCase(),
      );
    const matchingArtists =
      selectedSongsByFilename &&
      selectedSongsByFilename.map((song) => song.artist).join(", ");
    setArtistsByFilename(matchingArtists);
    setUserEditedTitle(false);
    const titleExists =
      fileNameWithoutExtension &&
      !songTitle &&
      songs.some(
        (song) =>
          song.title.toLowerCase() === fileNameWithoutExtension.toLowerCase(),
      );
    setTracksExists(titleExists);
    setSongArtist("");
    setSongTitle("");
    setSongAlbum("");
    setFileName(newFile ? fileNameWithoutExtension : "");
    setOptionsOpen(true);
  };

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setSongTitle(newTitle);
    const selectedSongsBySongtitle =
      newTitle &&
      songs.filter(
        (song) => newTitle.toLowerCase() === song.title.toLowerCase(),
      );
    const matchingArtists =
      selectedSongsBySongtitle &&
      selectedSongsBySongtitle.map((song) => song.artist).join(", ");
    setArtistsBySongtitle(matchingArtists);
    setUserEditedTitle(true);
    const titleExists =
      (newTitle &&
        !songArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === newTitle.toLowerCase(),
        )) ||
      (fileName &&
        !newTitle &&
        !songArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === fileName.toLowerCase(),
        )) ||
      (newTitle &&
        songArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === newTitle.toLowerCase() &&
            song.artist.toLowerCase() === songArtist.toLowerCase(),
        )) ||
      (!newTitle &&
        fileName &&
        songArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === fileName.toLowerCase() &&
            song.artist.toLowerCase() === songArtist.toLowerCase(),
        ));
    setTracksExists(titleExists);
  };

  const handleArtistChange = (event) => {
    const newArtist = event.target.value;
    setSongArtist(newArtist);
    const artistExists =
      (songTitle &&
        newArtist &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === songTitle.toLowerCase() &&
            song.artist.toLowerCase() === newArtist.toLowerCase(),
        )) ||
      (songTitle &&
        !newArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === songTitle.toLowerCase(),
        )) ||
      (fileName &&
        newArtist &&
        !songTitle &&
        songs.some(
          (song) =>
            song.title.toLowerCase() === fileName.toLowerCase() &&
            song.artist.toLowerCase() === newArtist.toLowerCase(),
        )) ||
      (fileName &&
        !newArtist &&
        songs.some(
          (song) => song.title.toLowerCase() === fileName.toLowerCase(),
        ));
    setTracksExists(artistExists);
  };

  const handleAlbumChange = (event) => {
    setSongAlbum(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);

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

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", songTitle || fileName);
    formData.append("artist", songArtist);
    formData.append("album", songAlbum);

    try {
      if (trackExists) {
        setError("A track with the same title and artist already exists.");
      } else {
        await axios.post(`${API_BASE_URL}${ENDPOINTS.upload_song}`, formData);
        setSongUploaded("Track uploaded successfully.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
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

  useEffect(() => {
    if (trackExists) {
      setOptionsOpen(true);
    }
  }, [trackExists]);

  return (
    <form
      name="upload-track-form"
      className="flex flex-col items-center justify-center gap-4 p-10 text-center"
      onSubmit={handleUpload}
    >
      <h2 className="mb-8 text-3xl font-thin text-white lg:text-4xl">
        <span className="text-bpmPink">Upload</span> your tracks.
      </h2>
      <Input
        className={`w-[90vw] min-w-[250px] max-w-[300px]  ${
          trackExists && "border-2 border-red-500 text-red-800"
        }`}
        id="Track"
        type="file"
        onChange={handleFileChange}
        required
      />
      {trackExists && (
        <div className="text-red-800">
          <p>
            This track title is already taken by&nbsp;
            <span className="text-white">
              {`${artistsBySongtitle || artistsByFilename}`}
            </span>
            <br />
            Please choose a different title or artist.
          </p>
        </div>
      )}
      <div className="grid-col-2 grid items-center justify-center">
        <div
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="col-start-1 row-start-1 flex cursor-pointer items-center gap-1 pl-1 text-sm font-thin text-gray-400 lg:text-base"
        >
          <span className="text-lg lg:text-lg">{optionsOpen ? "-" : "+"}</span>
          More Options
        </div>
        <Tooltip
          childrenStyle="text-2xl text-gray-600 row-start-1 col-start-2 justify-self-end p-1"
          message={"Audio file (WAV, MP3, AIFC, etc)"}
          position={"bottom"}
          variant={"dark"}
        >
          <HiOutlineQuestionMarkCircle />
        </Tooltip>
        <div
          className={`${
            optionsOpen ? "max-h-[500px]" : "max-h-[0px]"
          } text-md transition-max-w col-span-2 flex w-[90vw] min-w-[250px] max-w-[300px] flex-col overflow-hidden duration-300  ease-linear lg:text-lg`}
        >
          <div className="flex flex-col gap-3 p-1">
            <Input
              type="text"
              value={userEditedTitle ? songTitle : fileName}
              onChange={handleTitleChange}
              placeholder="Title"
              pattern={regexPatternString}
              title={regexMessage}
              className={trackExists && "border-2 border-red-500 text-red-800"}
            />
            <Input
              type="text"
              value={songArtist}
              onChange={handleArtistChange}
              placeholder="Artist (Required)"
              pattern={regexPatternString}
              title={regexMessage}
              className={trackExists && "border-2 border-red-500 text-red-800"}
              required
            />
            <Input
              type="text"
              value={songAlbum}
              onChange={handleAlbumChange}
              placeholder="Album"
              pattern={regexPatternString}
              title={regexMessage}
            />
          </div>
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        disabled={!selectedFile || trackExists || !songArtist}
        className="flex items-center justify-center gap-2 bg-bpmPink text-black duration-200 hover:bg-white"
      >
        Upload
        <HiMiniArrowUpTray className="text-lg lg:text-xl" />
      </Button>
    </form>
  );
}
