// Import necessary dependencies and components
"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import LoadingBar from "@/components/loadingbar";
import { HiTrash } from "react-icons/hi2";
import ErrorMessage from "@/components/errormessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WarningDialog from "@/components/warning-dialog";
import Dialog from "@/components/dialog";

// Define validation schema for the form
const FormSchema = z.object({
  id: z.number().refine(
    (value) => {
      const idString = value.toString();
      return /^[0-9]{8}$/.test(idString); // Check if it's an 8-digit number
    },
    {
      message: "Song ID must be an 8-digit number.",
    }
  ),
});

// Component responsible for deleting songs
function SongListDeleteForm({ songs, onSongDeleted }) {
  // State management
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [songDeleted, setSongDeleted] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  // React Hook Form initialization
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  // Handle form submission
  function onSubmit(data) {
    setLoading(true);

    const selectedSong = songs.find((song) => song.id === data.id);

    if (!selectedSong) {
      form.setError("id", {
        type: "manual",
        message: "Invalid song selected.",
      });
      return;
    }

    // Make API call to delete the song
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}delete_song`, data)
      .then((response) => {
        setOpenWarningDialog(false);
        onSongDeleted((prevCount) => prevCount + 1);
        setSongDeleted("Track deleted successfully.");
      })
      .catch((error) => {
        setOpenWarningDialog(false);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
        setSelectedSong("");
      });
  }

  return (
    <>
      {/* Display success dialog */}
      {!loading && songDeleted && (
        <Dialog message={songDeleted} onClick={() => setSongDeleted(false)} />
      )}
      {/* Display error dialog */}
      {!loading && error && (
        <Dialog message={error} onClick={() => setError(false)} />
      )}
      {form.formState.errors.id && (
        <Dialog message={form.formState.errors.id.message} />
      )}
      {/* Display loading bar */}
      {loading ? (
        <LoadingBar />
      ) : (
        // Display main form
        <div className='flex flex-col justify-center items-center gap-10 w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'>
          <h2 className='text-3xl lg:text-4xl text-white font-thin overflow-visible whitespace-nowrap'>
            <span className='text-bpmPink'>Delete</span> your tracks.
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col justify-center items-center gap-8'
            >
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem className='w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'>
                    {/* Dropdown for selecting a song */}
                    <Select
                      onValueChange={(stringSongId) => {
                        const intSongId = parseInt(stringSongId);

                        field.onChange(intSongId);

                        const selectedSongById = songs.find(
                          (song) => song.id === intSongId
                        );

                        setSelectedSong(selectedSongById);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {songs.length === 0 ? (
                              "No tracks to delete."
                            ) : selectedSong ? (
                              <>
                                <span className='text-bpmPink'>
                                  {selectedSong.artist}
                                </span>{" "}
                                - {selectedSong.title}
                              </>
                            ) : (
                              "Select a track"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='w-[90vw] max-w-[300px] min-w-[250px] min-h-[40vh] max-h-[300px] text-md lg:text-lg'>
                        <SelectGroup>
                          {/* Display available song options */}
                          {songs.map((song) => (
                            <SelectItem
                              key={song.id.toString()}
                              value={song.id.toString()}
                            >
                              {song.title}
                              <br />
                              <span className='text-bpmPink'>
                                {song.artist}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Delete button */}
              <Button
                onClick={() => setOpenWarningDialog(true)}
                disabled={!selectedSong}
                size='lg'
                className='bg-bpmPink text-black hover:bg-white duration-200 flex justify-center items-center gap-2'
                type='button'
              >
                Delete
                <HiTrash className='text-lg lg:text-xl' />
              </Button>
              {/* Display warning dialog */}
              {openWarningDialog && (
                <WarningDialog
                  title={"Are you sure?"}
                  message={
                    "This action cannot be undone. This will permanently delete the track."
                  }
                  onClickCancel={() => setOpenWarningDialog(false)}
                />
              )}
            </form>
          </Form>
        </div>
      )}
    </>
  );
}

// Main page component
function Page() {
  // State management
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [deleteCount, setDeleteCount] = useState(0);

  // Fetch songs when the component mounts
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}database_songs`)
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
      {/* Container for page content */}
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center'>
          {/* Display error message */}
          {error && <ErrorMessage message={error} />}
          {!error &&
            (loading ? (
              // Display loading bar
              <LoadingBar />
            ) : (
              // Display the song deletion form
              <SongListDeleteForm
                songs={songs}
                onSongDeleted={setDeleteCount}
              />
            ))}
        </div>
      </div>
    </>
  );
}

// Export the main page component
export default Page;
