"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { API_BASE_URL, ENDPOINTS } from "@/config";

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
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Component for displaying the song list in a table
function SongListTable({ songs }) {
  return (
    <>
      <div>
        {/* Scrollable area for the table */}
        <ScrollArea className="h-[75vh] rounded-md border px-6 py-4">
          {/* Table for displaying song information */}
          <Table className="text-left text-base font-thin lg:text-xl">
            <TableCaption>
              {songs.length}{" "}
              {songs.length === 1 ? "result was found." : "results were found."}
            </TableCaption>
            <TableBody className="text-white">
              {/* Map through each song and display in a table row */}
              {songs.map((song, index) => (
                <TableRow key={index}>
                  {/* Display song details in table cells */}
                  <TableCell>{song.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
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
      .get(`${API_BASE_URL}${ENDPOINTS.database_songs}`)
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setLoading(false);
        setError(error.message);
      });
  }, []);

  return (
    <>
      {/* Container for the entire page */}
      <div className="container mt-navbarHeight flex  h-pageHeight flex-col items-center justify-center p-10 lg:max-h-none">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Display error message if there's an error */}
          {error && <ErrorMessage message={error} />}
          {!error &&
            // Display loading bar or song list if there's no error
            (loading ? (
              <LoadingBar />
            ) : songs.length === 0 ? (
              <>
                <h2 className="text-2xl font-thin text-white lg:text-4xl">
                  <span className="text-bpmPink">No </span>tracks were found.
                </h2>
                <Link href="/add-track">
                  <Button
                    size="lg"
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-bpmPink text-black duration-200 hover:bg-white"
                  >
                    Upload Track
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="mb-5 text-2xl font-thin text-white lg:text-4xl">
                  <span className="text-bpmPink">Your </span>tracks.
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
