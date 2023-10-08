"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "@/config";
import UploadTrackForm from "@/components/uploadTrackForm";
import LoadingBar from "@/components/loadingbar";
import Dialog from "@/components/dialog";

function Page() {
  const [songs, setSongs] = useState([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [songUploaded, setSongUploaded] = useState("");
  const [error, setError] = useState("");

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

  return (
    <>
      {songUploaded && (
        <Dialog message={songUploaded} onClick={() => setSongUploaded(false)} />
      )}
      {error && <Dialog message={error} onClose={() => setError("")} />}
      <div className="container mt-navbarHeight flex h-pageHeight max-h-maxMobilePageHeight flex-col items-center justify-center lg:max-h-none">
        {!error && loading ? (
          <LoadingBar />
        ) : (
          <UploadTrackForm
            songs={songs}
            setUploadCount={setUploadCount}
            setLoading={setLoading}
            setError={setError}
            setSongUploaded={setSongUploaded}
          />
        )}
      </div>
    </>
  );
}

export default Page;
