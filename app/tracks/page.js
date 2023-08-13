"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Component for displaying the song list in a table
function SongListTable({ songs }) {
  return (
    <>
      {/* Scrollable area for the table */}
      <ScrollArea className='h-[75vh] max-h-[550px] py-4 px-6 rounded-md border'>
        {/* Table for displaying song information */}
        <Table className='text-left font-thin text-base lg:text-xl'>
          <TableCaption>A list of all the tracks.</TableCaption>
          <TableHeader>
            {/* Table header row */}
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Album</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-white'>
            {/* Map through each song and display in a table row */}
            {songs.map((song, index) => (
              <TableRow key={index}>
                {/* Display song details in table cells */}
                <TableCell className='text-bpmPink'>{song.artist}</TableCell>
                <TableCell>{song.title}</TableCell>
                <TableCell className='text-bpmPink'>{song.album}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}

// Main component for the page
function Page() {
  // State variables
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch songs data from the server when the component mounts
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/database_songs`)
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
        console.log({ songs });
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setLoading(false);
        setError("Error fetching songs. Please try again later.");
      });
  }, []);

  return (
    <>
      {/* Container for the entire page */}
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center mt-16'>
          {/* Display error message if there's an error */}
          {error && <ErrorMessage message={error} />}
          {!error &&
            // Display loading bar or song list if there's no error
            (loading ? (
              <LoadingBar />
            ) : (
              <>
                <h2 className='text-3xl lg:text-4xl text-white font-thin'>
                  <span className='text-bpmPink'>Your </span>tracks.
                </h2>
                {/* Display SongListTable component if there are songs */}
                {songs.length !== 0 && <SongListTable songs={songs} />}
              </>
            ))}
        </div>
      </div>
    </>
  );
}

export default Page;
