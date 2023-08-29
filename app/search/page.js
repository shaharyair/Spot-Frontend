// Import necessary dependencies and components
"use client";
import { useState } from "react";
import axios from "axios";
import Dialog from "@/components/dialog";
import LoadingBar from "@/components/loadingbar";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { CalendarIcon } from "lucide-react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import EmblaCarousel from "components/emblaCarousel";

const FormSchema = z.object({
  location: z.string({ required_error: "A location is required." }),
  date: z.date({
    required_error: "A date is required.",
  }),
});

function SpotTracksForm({ onStoriesSearch, setLoading, setError }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    data.date = format(data.date, "dd-MM-yyyy");

    setLoading(true);

    console.log(data);
    console.log("searching tracks...");

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}location_songs`, data)
      .then((response) => {
        onStoriesSearch(response.data);
        setLoading(false);
        console.log("searched successfully.");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }

  const locations = [
    { title: "art club" },
    { title: "Kolaj Bar" },
    { title: "Yula Bar" },
  ];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col justify-center items-center gap-4 p-10'
        >
          <h2 className='text-3xl lg:text-4xl mb-4 text-white font-thin'>
            <span className='text-bpmPink'>Spot</span> your tracks.
          </h2>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          "w-[90vw] max-w-[300px] min-w-[250px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? locations.find(
                              (location) => location.title === field.value
                            )?.title
                          : "Pick a Location"}
                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[90vw] max-w-[300px] min-w-[250px] p-0'>
                    <Command>
                      <CommandInput
                        placeholder='Search Location...'
                        className='h-9'
                      />
                      <CommandEmpty>No Locations found.</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location, i) => (
                          <CommandItem
                            value={location.title}
                            key={i}
                            onSelect={() => {
                              setSelectedLocation(location.title);
                              form.setValue("location", location.title);
                            }}
                          >
                            {location.title}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                location.title === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[90vw] max-w-[300px] min-w-[250px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      className='w-[90vw] max-w-[300px] min-w-[250px] flex justify-center items-center'
                      mode='single'
                      selected={field.value}
                      onSelect={(selectDate) => {
                        setSelectedDate(selectDate);
                        field.onChange(selectDate);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className='ml-1'>
                  Enter the date you want to Spot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!selectedLocation || !selectedDate}
            type='submit'
            className='mt-2 gap-2'
            size='lg'
          >
            Search
            <HiMagnifyingGlass className='text-lg ' />
          </Button>
        </form>
      </Form>
    </>
  );
}

// Main component function
export default function Page() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      {error && <Dialog message={error} onClick={() => setError(false)} />}
      <div className='container mt-24 min-h-[87dvh] flex flex-col justify-center items-center'>
        {!error && loading ? (
          <LoadingBar />
        ) : stories.length === 0 ? (
          <SpotTracksForm
            onStoriesSearch={setStories}
            setLoading={setLoading}
            setError={setError}
          />
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
