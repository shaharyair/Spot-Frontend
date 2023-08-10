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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  id: z
    .string()
    .nonempty({ message: "Please select a track to delete." })
    .regex(/^[0-9]+$/, { message: "Invalid track ID format." })
    .min(1, { message: "Invalid track ID format." }),
});

function SongListDeleteForm({ songs }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    const songIdInt = parseInt(data.id);

    console.log("Form submitted with data:", songIdInt);

    axios
      .post("http://127.0.0.1:5000/api/delete_song", { id: songIdInt })
      .then((response) => {
        console.log("Song deleted successfully!");
        alert("Song deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Failed to delete the song.", error);
        alert("Failed to delete the song!");
      });
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center gap-8'>
        <h2 className='text-3xl lg:text-4xl text-white font-thin'>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a track' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tracks</SelectLabel>
                        {songs.map((song, index) => (
                          <SelectItem key={index} value={song.id}>
                            {song.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size='lg'
              type='submit'
              className='bg-bpmPink text-black hover:bg-white duration-200 flex justify-center items-center gap-2'
            >
              Delete
              <HiTrash className='text-lg lg:text-xl' />
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

function Page() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/database_songs`)
      .then((response) => {
        setSongs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setLoading(false);
        setError("Error fetching songs. Please try again later.");
      });
  }, []);

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center'>
          {error && <ErrorMessage message={error} />}
          {!error &&
            (loading ? <LoadingBar /> : <SongListDeleteForm songs={songs} />)}
        </div>
      </div>
    </>
  );
}

export default Page;
