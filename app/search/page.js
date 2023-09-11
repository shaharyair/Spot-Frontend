// Import necessary dependencies and components
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import { API_BASE_URL, ENDPOINTS } from "@/config";

import Dialog from "@/components/dialog";
import LoadingBar from "@/components/loadingbar";

import SpotSearchForm from "@/components/spotSearchForm";
import EmblaCarousel from "components/emblaCarousel";
import { LocationRequestForm } from "@/components/locationRequestForm";

// Main component function
export default function Page() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchNoMatch, setSearchNoMatch] = useState("");
  const [locationsData, setLocationsData] = useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .post(`${API_BASE_URL}${ENDPOINTS.locations}`, {
        dashboard: "Yost Koen",
      })
      .then((response) => {
        setLocationsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {searchNoMatch && (
        <Dialog
          message={searchNoMatch}
          onClick={() => setSearchNoMatch(false)}
        />
      )}
      {error && <Dialog message={error} onClick={() => setError(false)} />}
      <div className='container mt-24 min-h-[87dvh] flex flex-col justify-center items-center'>
        {!error && loading ? (
          <LoadingBar />
        ) : stories.length === 0 ? (
          <>
            <SpotSearchForm
              onStoriesSearch={setStories}
              setLoading={setLoading}
              setError={setError}
              setSearchNoMatch={setSearchNoMatch}
              locationsData={locationsData}
            />
            <LocationRequestForm />
          </>
        ) : (
          <>
            <EmblaCarousel
              slides={stories}
              options={{
                loop: true,
                align: "center",
                inViewThreshold: 1,
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
