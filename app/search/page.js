// Import necessary dependencies and components
"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LoadingBar from "@/components/loadingbar";
import Dialog from "@/components/dialog";

// Function to capitalize the first letter of every word in a string
function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}

// Main component function
function Page() {
  // State variables using the useState hook
  const [username, setUsername] = useState("");
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const regexPattern = /[a-zA-Z][a-zA-Z0-9._]{1,29}$/;
  const regexMessage =
    "Username must start with a letter and can only contain letters, numbers, periods, and underscores.";

  // Validation function for text inputs
  const isValidText = (text) => {
    return regexPattern.test(text);
  };

  // Event handler for username input change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidText(username)) {
      setError(regexMessage);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearched(false);
    setSongsData([]);
    setError(null);

    try {
      // Make a GET request to fetch songs data based on the provided username
      const response = await axios.get(`http://127.0.0.1:5000/api/songs`, {
        params: { username },
      });

      // Update state with fetched songs data and set searched to true
      setSongsData(response.data);
      setSearched(true);
    } catch (error) {
      // Handle errors by setting an error message
      setError(error.message);
    } finally {
      // Set loading to false and reset username field
      setLoading(false);
      setUsername("");
    }
  };

  // JSX rendering
  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-12'>
          {loading ? (
            // Show loading bar when data is being fetched
            <LoadingBar />
          ) : (
            <>
              {/* Heading and search form */}
              <h2 className='text-3xl lg:text-4xl text-white font-thin'>
                <span className='text-bpmPink'>Spot</span> your tracks.
              </h2>
              <form
                className='flex justify-center items-center gap-2'
                onSubmit={handleSubmit}
              >
                {/* Input field for username */}
                <Input
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={handleUsernameChange}
                  pattern={regexPattern}
                  title={regexMessage}
                  required
                  className='w-[50vw] max-w-[250px] min-w-[200px]'
                />
                {/* Submit button */}
                <Button
                  type='submit'
                  className='bg-bpmPink text-black hover:bg-white duration-200 px-5'
                  disabled={!username}
                >
                  <HiMagnifyingGlass className='text-lg lg:text-xl' />
                </Button>
              </form>
            </>
          )}
          {/* Display error message as a dialog */}
          {error && <Dialog message={error} onClick={() => setError(false)} />}
          {/* Display search results */}
          {searched && (
            <div className='flex flex-col justify-center items-center py-4 px-6 bg-navbarBlack2 rounded-md drop-shadow-lg gap-3 animate-fade-in text-white text-lg lg:text-xl font-thin'>
              {/* Display no results message */}
              {songsData.length === 0 && searched && (
                <h2>No results were found.</h2>
              )}
              {/* Display search results count */}
              {songsData.length !== 0 && (
                <h2>
                  {songsData.length}&nbsp;
                  {songsData.length === 1
                    ? "result was found:"
                    : "results were found:"}
                </h2>
              )}
              {/* Display each song's title */}
              {songsData.map((song, index) => (
                <div key={index}>
                  <p>
                    <span className='text-bpmPink'>Title: </span>
                    {capitalizeEveryWord(song.title)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Export the component as the default export
export default Page;
