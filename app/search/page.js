// Import necessary dependencies and components
"use client";
import { useState } from "react";
import axios from "axios";
import Dialog from "@/components/dialog";
import LoadingBar from "@/components/loadingbar";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { CalendarIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
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

function CalendarForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data) {
    console.log(format(data.date, "dd/MM/yyyy"));
    console.log(data.location);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col justify-center items-center gap-4'
        >
          <h2 className='text-3xl lg:text-4xl mb-4 text-white font-thin'>
            <span className='text-bpmPink'>Spot</span> your tracks.
          </h2>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem className='w-[90vw] max-w-[300px] min-w-[250px] text-md lg:text-lg'>
                <FormControl>
                  <Input placeholder='Location' {...field} />
                </FormControl>
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
          <Button type='submit' className='mt-2 gap-2' size='lg'>
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
  return (
    <>
      <div className='container mt-24 p-14 min-h-[650px] flex justify-center items-center'>
        <EmblaCarousel
          slides={[
            "https://drive.google.com/uc?id=1tn6-RtGJqk2zNIoaL7oKLfE6f_WErmTZ",
            "https://drive.google.com/uc?id=1jolteKG_n8PAE8NHJgdevwqo53O3VKBu",
            "https://drive.google.com/uc?id=1KESnzSgSlhJt1E5gP6g0tKV1YFMObR01",
            "https://drive.google.com/uc?id=1LwTsb1fsXpT9TkWcMAWWboxoF5kqcSzA",
            "https://drive.google.com/uc?id=1x06vLK_52GxzW_2w5XKD__zAtUaa3DuS",
            "https://drive.google.com/uc?id=1FtZatD-vUClc-GCJIqLOBPxlptNN1TJI",
            "https://drive.google.com/uc?id=1KiyTrUHjzIWMmZNrVgXeWsjrjJ7R8d2M",
          ]}
          options={{
            loop: true,
            align: "center",
            inViewThreshold: 1,
          }}
        />
        {/* <CalendarForm /> */}
      </div>
    </>
  );
}
