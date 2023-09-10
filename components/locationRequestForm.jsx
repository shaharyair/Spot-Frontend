"use client";

import { useState } from "react";
import { API_BASE_URL, ENDPOINTS, EMAILS } from "@/config";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Dialog from "./dialog";

import { HiChevronDown } from "react-icons/hi2";

const FormSchema = z.object({
  locationWanted: z.string().refine((value) => /^[A-Za-z0-9\s]+$/.test(value), {
    message: "Enter only A-z, spaces and numbers.",
  }),
  email: z
    .string()
    .refine(
      (value) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value),
      {
        message: "Enter a valid email address.",
      }
    ),
  fullname: z.string().refine((value) => /^[A-Za-z\s]+$/.test(value), {
    message: "Enter only A-z and spaces",
  }),
});

export function LocationRequestForm() {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [locationSubmitted, setLocationSubmitted] = useState("");
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const isFormEmpty =
    !form.watch("locationWanted") ||
    !form.watch("email") ||
    !form.watch("fullname");

  function onSubmit(data) {
    data.recipients = [EMAILS.shahar, EMAILS.shaked, EMAILS.gil];
    console.log(data);

    axios
      .post(`${API_BASE_URL}${ENDPOINTS.send_location_email}`, data)
      .then((response) => {
        setLocationSubmitted("Request Submitted!");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }

  return (
    <>
      {locationSubmitted && (
        <Dialog
          message={locationSubmitted}
          onClick={() => setLocationSubmitted(false)}
        />
      )}
      {error && <Dialog message={error} onClick={() => setError(false)} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex justify-center items-center flex-col p-10 gap-4'
        >
          <div
            className='text-lg text-gray-400 hover:text-white transition-colors duration-200 font-thin flex justify-center items-center gap-2 cursor-pointer'
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <h2>Looking for another location ?</h2>
            <HiChevronDown
              className={`transition-transform duration-300  ${
                optionsOpen ? "rotate-180" : null
              }`}
            />
          </div>
          <div
            className={`${
              optionsOpen ? "max-h-[500px]" : "max-h-[0px]"
            } overflow-hidden transition-max-w duration-300 ease-linear flex justify-center items-center flex-col gap-4 p-1`}
          >
            <FormField
              control={form.control}
              name='locationWanted'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Location (Include details)'
                      {...field}
                      className='w-[90vw] max-w-[300px] min-w-[250px]'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Email'
                      {...field}
                      className='w-[90vw] max-w-[300px] min-w-[250px]'
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='fullname'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Full Name'
                      {...field}
                      className='w-[90vw] max-w-[300px] min-w-[250px]'
                      required
                    />
                  </FormControl>
                  <FormDescription>Enter your information.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' size='lg' disabled={isFormEmpty}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
