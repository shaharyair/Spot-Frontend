"use client";

import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "@/config";
import { useState } from "react";
import LoadingBar from "@/components/loadingbar";
import { Button } from "@/components/ui/button";
import { HiArrowPath } from "react-icons/hi2";
import WarningDialog from "@/components/warning-dialog";
import Dialog from "@/components/dialog";

function Page() {
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRescan, setIsRescan] = useState("");

  const onSubmit = () => {
    setOpenWarningDialog(false);
    setLoading(true);

    axios
      .post(`${API_BASE_URL}${ENDPOINTS.rescan}`)
      .then((response) => {
        setIsRescan("Database Rescanned Successfully.");
        console.log(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {error && !openWarningDialog && (
        <Dialog message={error} onClick={() => setError(false)} />
      )}
      {isRescan && !error && !openWarningDialog && (
        <Dialog message={isRescan} onClick={() => setIsRescan(false)} />
      )}
      {openWarningDialog && (
        <WarningDialog
          title={"Are you sure?"}
          message={
            "This action cannot be undone. This will rescan the entire database."
          }
          onClickCancel={() => setOpenWarningDialog(false)}
          onClickAction={() => onSubmit()}
        />
      )}
      <div className="container mt-navbarHeight flex h-pageHeight flex-col items-center justify-center lg:max-h-none">
        {loading && !error ? (
          <LoadingBar />
        ) : (
          <Button
            onClick={() => setOpenWarningDialog(true)}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl px-8 py-8 text-xl drop-shadow-md duration-200 hover:bg-white"
          >
            Rescan
            <HiArrowPath className="text-2xl" />
          </Button>
        )}
      </div>
    </>
  );
}

export default Page;
