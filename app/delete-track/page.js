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

const FormSchema = z.object({
  id: z.number({}),
});

function SongListDeleteForm({ songs, onSongDeleted }) {
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [songDeleted, setSongDeleted] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    setLoading(true);

    axios
      .post("http://127.0.0.1:5000/api/delete_song", data)
      .then((response) => {
        setOpenWarningDialog(false);
        setSongDeleted("Track deleted successfully.");
        setLoading(false);
      })
      .catch((error) => {
        setOpenWarningDialog(false);
        setError(error.message);
        setLoading(false);
      });
  }

  return (
    <>
      {!loading && songDeleted && (
        <Dialog message={songDeleted} onClick={() => setSongDeleted(false)} />
      )}
      {!loading && error && (
        <Dialog message={error} onClick={() => setError(false)} />
      )}
      {loading ? (
        <LoadingBar />
      ) : (
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
                    <Select
                      onValueChange={(value) => {
                        const selectedSong = songs.find(
                          (song) => song.title === value
                        );

                        console.log(selectedSong);

                        setSelectedSongId(selectedSong.id);

                        console.log(selectedSongId);

                        field.onChange(selectedSongId);
                      }}
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
                            <SelectItem key={index} value={song.title}>
                              {song.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                // onClick={() => setOpenWarningDialog(true)}
                size='lg'
                className='bg-bpmPink text-black hover:bg-white duration-200 flex justify-center items-center gap-2'
                type='submit'
              >
                Delete
                <HiTrash className='text-lg lg:text-xl' />
              </Button>
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

function Page() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  const handleSongDeleted = (deletedSongId) => {
    setSongs((prevSongs) =>
      prevSongs.filter((song) => song.id !== deletedSongId)
    );
  };

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
        setError(error.message);
      });
  }, []);

  return (
    <>
      <div className='container h-[98vh] min-h-[650px] flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-8 text-center'>
          {error && <ErrorMessage message={error} />}
          {!error &&
            (loading ? (
              <LoadingBar />
            ) : (
              <SongListDeleteForm
                songs={songs}
                onSongDeleted={handleSongDeleted}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Page;
