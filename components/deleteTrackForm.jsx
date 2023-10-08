import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "@/config";
import { Button } from "@/components/ui/button";
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
import WarningDialog from "@/components/warning-dialog";
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
    },
  ),
});

// Component responsible for deleting songs
export default function DeleteTrackForm({
  songs,
  onSongDeleted,
  isSongDeleted,
  setError,
  setLoading,
}) {
  // State management
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

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
        isSongDeleted("Track deleted successfully.");
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
      <div className="flex flex-col items-center justify-center gap-10 p-10 font-thin ">
        <h2 className="text-3xl text-white lg:text-4xl">
          <span className="text-bpmPink">Delete</span> your tracks.
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-8"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "relative flex h-auto min-h-[2.25rem] w-[90vw] min-w-[250px] max-w-[300px] flex-col items-start justify-center pr-6 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? (() => {
                                const matchedSong = songs.find(
                                  (song) => song.id === field.value,
                                );
                                setSelectedSong(matchedSong);
                                if (matchedSong) {
                                  return (
                                    <>
                                      <h1>{matchedSong.title}</h1>
                                      <h1 className="text-bpmPink">
                                        {matchedSong.artist}
                                      </h1>
                                    </>
                                  );
                                } else {
                                  return "Select a Track";
                                }
                              })()
                            : "Select a Track"}
                          <CaretSortIcon className=" absolute right-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[90vw] min-w-[250px] max-w-[300px] p-0">
                      <ScrollArea className="h-[40vh] max-h-[300px]">
                        <Command>
                          <CommandInput
                            placeholder="Search Track"
                            className="h-9"
                          />
                          <CommandEmpty>No Tracks Found.</CommandEmpty>
                          <CommandGroup>
                            {songs.map((song) => {
                              // combined string of title, artist and album for search
                              const combinedValue = `${song.title} ${song.artist} ${song.album}`;

                              return (
                                <CommandItem
                                  className="flex-col items-start justify-center px-3 hover:aria-selected:bg-gray-200"
                                  value={combinedValue} // Use the combined string as the value
                                  key={song.id}
                                  onSelect={() => {
                                    form.setValue("id", song.id);
                                  }}
                                >
                                  {song.title}
                                  <span className="text-bpmPink">
                                    {song.artist}
                                  </span>
                                  <CheckIcon
                                    className={cn(
                                      "absolute right-1 h-4 w-4",
                                      song.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
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
              size="lg"
              className="flex items-center justify-center gap-2 bg-bpmPink text-black duration-200 hover:bg-white"
              type="button"
            >
              Delete
              <HiTrash className="text-lg lg:text-xl" />
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
    </>
  );
}
