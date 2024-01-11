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
  const [userEditedTitle, setUserEditedTitle] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [trackExists, setTracksExists] = useState(false);

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

    setUserEditedTitle(false);

    const titleExists =
      fileNameWithoutExtension &&
      !songTitle &&
      songs.some(
        (song) =>
          song.title.toLowerCase() === fileNameWithoutExtension.toLowerCase(),
      );

    setTracksExists(titleExists);
    setFileName(newFile ? fileNameWithoutExtension : "");
    setOptionsOpen(true);
  };

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setSongTitle(newTitle);

    setUserEditedTitle(true);
    const titleExists =
      (newTitle &&
        songs.some(
          (song) => song.title.toLowerCase() === newTitle.toLowerCase(),
        )) ||
      (fileName &&
        !newTitle &&
        songs.some(
          (song) => song.title.toLowerCase() === fileName.toLowerCase(),
        ));
    setTracksExists(titleExists);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedFile) {
      setError("Please select a track.");
      setLoading(false);
      return;
    }

    if (
      (fileName && !isValidText(fileName)) ||
      (songTitle && !isValidText(songTitle))
    ) {
      setError(regexMessage);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", songTitle || fileName);

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
        <div className="text-white">
          <p>
            Track title already exists
            <br />
            Please choose a different title
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
            optionsOpen ? "max-h-[200px]" : "max-h-[0px]"
          } text-md transition-max-w col-span-2 flex w-[90vw] min-w-[250px] max-w-[300px] flex-col overflow-hidden duration-300  ease-linear lg:text-lg`}
        >
          <div className="flex flex-col gap-3 p-1">
            <Input
              type="text"
              value={userEditedTitle ? songTitle : fileName}
              onChange={handleTitleChange}
              placeholder="Track Title"
              pattern={regexPatternString}
              title={regexMessage}
              className={trackExists && "border-2 border-red-500 text-red-800"}
            />
          </div>
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        disabled={!selectedFile || trackExists}
        className="flex items-center justify-center gap-2 bg-bpmPink text-black duration-200 hover:bg-white"
      >
        Upload
        <HiMiniArrowUpTray className="text-lg lg:text-xl" />
      </Button>
    </form>
  );
}
