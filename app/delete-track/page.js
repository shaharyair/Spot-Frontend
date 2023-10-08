// Import necessary dependencies and components
"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "@/config";
import DeleteTrackForm from "@/components/deleteTrackForm";
import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";
import Dialog from "@/components/dialog";

// Main page component
export default function Page() {
  // State management
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [isSongDeleted, setIsSongDeleted] = useState("");

  // Fetch songs when the component mounts
  useEffect(() => {
    setLoading(true);

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
  }, [deleteCount]);

  return (
    <>
      {/* Display success dialog */}
      {!loading && isSongDeleted && (
        <Dialog
          message={isSongDeleted}
          onClick={() => setIsSongDeleted(false)}
        />
      )}
      {/* Display error dialog */}
      {!loading && error && (
        <Dialog message={error} onClick={() => setError(false)} />
      )}
      {/* Container for page content */}
      <div className="container mt-navbarHeight flex h-pageHeight flex-col items-center justify-center lg:max-h-none">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Display error message */}
          {error && <ErrorMessage message={error} />}
          {!error &&
            (loading ? (
              // Display loading bar
              <LoadingBar />
            ) : (
              // Display the song deletion form
              <DeleteTrackForm
                songs={songs}
                onSongDeleted={setDeleteCount}
                isSongDeleted={setIsSongDeleted}
                setError={setError}
                setLoading={setLoading}
              />
            ))}
        </div>
      </div>
    </>
  );
}
