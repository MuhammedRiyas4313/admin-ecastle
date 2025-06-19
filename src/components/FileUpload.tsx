"use client";
import { generateFilePath } from "@/services/url.service";
import Image from "next/image";
import React, { useState } from "react";

function FileUpload({
  onFileChange,
  accept = "image/*,video/*", // Default to accept both images and videos
  label = "",
  value = "",
}: {
  onFileChange: (val: { mimeType: string; value: string }) => void;
  accept?: string;
  label?: string;
  value: string;
}) {
  const [file, setFile] = useState("");

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) { };
  };

  const handleFileSelection = (event: any) => {
    if (event.target.files[0]) {
      getBase64(event.target.files[0], (result: any) => {
        setFile(event.target.files[0]);
        onFileChange({
          mimeType: event.target.files[0].type,
          value: `${event.target.files[0].name}@@${result}`,
        });
      });
    }
  };

  const handleViewFileInANewWindow = (valueBase64: string, mimeType: string) => {
    let content;

    if (mimeType.startsWith("video")) {
      content = `
        <video width='100%' height='100%' controls>
          <source src='${valueBase64}' type='${mimeType}'>
          Your browser does not support the video tag.
        </video>`;
    } else {
      content = `<img width='100%' height='100%' src='${valueBase64}' />`;
    }

    if (typeof window !== "undefined") {
      const x = window.open();
      if (x) {
        x.document.open();
        x.document.write(content);
        x.document.close();
      }
    }
  };

  return (
    <>
      {label && label !== "" ? (
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      ) : (
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Attach file
        </label>
      )}

      {value && value !== "" && value.includes("base64") ? (
        <>
          {value.includes("image") ? (
            <div
              className="py-2"
              onClick={() =>
                handleViewFileInANewWindow(value.split("@@")[1], "image/*")
              }
            >
              <Image
                alt={"File preview"}
                src={value.split("@@")[1]}
                height={150}
                width={150}
              />
            </div>
          ) : (
            <div
              className="py-2"
              onClick={() =>
                handleViewFileInANewWindow(value.split("@@")[1], "video/*")
              }
            >
              <video
                width={150}
                height={150}
                controls
                src={value.split("@@")[1]}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      ) : (
        <div
          className="py-2"
          onClick={() => handleViewFileInANewWindow(generateFilePath(value), "image/*")}
        >
          {
          value?.split(".")[1] === "mp4" ? <video
          width={150}
          height={150}
          controls
          src={generateFilePath(value)}
        >
          Your browser does not support the video tag.
        </video>: 
          <Image
          alt={"File preview"}
          src={generateFilePath(value)}
          height={150}
          width={150}
          />
        }
        </div>
      )}

      <input
        type="file"
        accept={accept}
        onChange={handleFileSelection}
        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
      />
    </>
  );
}

export default FileUpload;
