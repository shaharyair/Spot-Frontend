// Import necessary dependencies and components
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import { API_BASE_URL, ENDPOINTS } from "@/config";

import Dialog from "@/components/dialog";
import LoadingBar from "@/components/loadingbar";

import SpotSearchForm from "@/components/spotSearchForm";
import StoriesCarouselPopup from "@/components/storiesCarousel";
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

    const data = {
      username: "Yost Koen", // Temporary username hardcode until user system feature.
    };

    axios
      .post(`${API_BASE_URL}${ENDPOINTS.locations}`, data)
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
      <div className="container mt-navbarHeight flex h-pageHeight flex-col items-center justify-center lg:max-h-none">
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
            <StoriesCarouselPopup
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
