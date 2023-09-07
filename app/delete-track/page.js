// Import necessary dependencies and components
"use client";
import axios from "axios";
import { useState, useEffect } from "react";

import { API_BASE_URL, ENDPOINTS } from "@/config";

import { Button } from "@/components/ui/button";

import LoadingBar from "@/components/loadingbar";
import ErrorMessage from "@/components/errormessage";
import WarningDialog from "@/components/warning-dialog";
import Dialog from "@/components/dialog";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { HiTrash } from "react-icons/hi2";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

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
  const [selectedSong, setSelectedSong] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // React Hook Form initialization
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  // Handle form submission
  function onSubmit(data) {
    setLoading(true);

    if (!selectedSong) {
      form.setError("id", {
        type: "manual",
        message: "Invalid song selected.",
      });
      return;
    }

    // Make API call to delete the song
    axios
      .post(`${API_BASE_URL}${ENDPOINTS.delete_song}`, data)
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
        <div className='flex flex-col justify-center items-center gap-10 p-10 font-thin '>
          <h2 className='text-3xl lg:text-4xl text-white'>
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
                  <FormItem className='flex flex-col justify-center items-center'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              "w-[90dvw] max-w-[300px] min-w-[250px] relative flex flex-col font-normal items-start justify-center pr-6 text-left min-h-[2.25rem] h-auto",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const matchedSong = songs.find(
                                    (song) => song.id === field.value
                                  );
                                  setSelectedSong(matchedSong);
                                  if (matchedSong) {
                                    return (
                                      <>
                                        <h1>{matchedSong.title}</h1>
                                        <h1 className='text-bpmPink'>
                                          {matchedSong.artist}
                                        </h1>
                                      </>
                                    );
                                  } else {
                                    return "Select a Track";
                                  }
                                })()
                              : "Select a Track"}
                            <CaretSortIcon className=' absolute right-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[90dvw] max-w-[300px] min-w-[250px] p-0'>
                        <ScrollArea className='h-[40dvh] max-h-[300px]'>
                          <Command>
                            <CommandInput
                              placeholder='Search Track'
                              className='h-9'
                            />
                            <CommandEmpty>No Tracks Found.</CommandEmpty>
                            <CommandGroup>
                              {songs.map((song) => {
                                // combined string of title, artist and album for search
                                const combinedValue = `${song.title} ${song.artist} ${song.album}`;

                                return (
                                  <CommandItem
                                    className='flex-col items-start justify-center px-3 hover:aria-selected:bg-gray-200'
                                    value={combinedValue} // Use the combined string as the value
                                    key={song.id}
                                    onSelect={() => {
                                      form.setValue("id", song.id);
                                    }}
                                  >
                                    {song.title}
                                    <span className='text-bpmPink'>
                                      {song.artist}
                                    </span>
                                    <CheckIcon
                                      className={cn(
                                        "absolute h-4 w-4 right-1",
                                        song.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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
      {/* Container for page content */}
      <div className='container mt-24 min-h-[88dvh] flex flex-col justify-center items-center'>
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
