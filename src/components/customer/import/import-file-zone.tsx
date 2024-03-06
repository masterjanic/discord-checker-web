"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiLoader } from "react-icons/fi";
import {
  PiArrowsClockwiseDuotone,
  PiFile,
  PiFilePlusDuotone,
  PiStopDuotone,
  PiTrashDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import useTokenImport from "~/hooks/useTokenImport";
import { getTokenMatchesForString } from "~/lib/discord-utils";
import { cn } from "~/lib/utils";

interface DroppedFile {
  file: File;
  loading: boolean;
  tokens: string[];
}

/**
 * Convert a file size in bytes to a human-readable string
 * @param size The file size in bytes
 */
const fileSizeToString = (size: number) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (size === 0) {
    return "0 B";
  }
  const i = Math.floor(Math.log(size) / Math.log(1024));
  if (i === 0) {
    return `${size} ${sizes[i]}`;
  }
  return `${(size / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export default function ImportFileZone() {
  const {
    running: isChecking,
    cancel,
    start,
    tokens,
    settings,
    addTokens,
    removeTokens,
    clearTokens,
    pendingCancellation,
  } = useTokenImport();
  const [drops, setDrops] = useState<DroppedFile[]>([]);

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/*": [
        ".csv",
        ".json",
        ".txt",
        ".xml",
        ".html",
        ".htm",
        ".js",
        ".xsl",
        ".xbl",
      ],
    },
    maxFiles: 10,
    maxSize: 1e9, // 1 GB
    multiple: true,
    onDropAccepted: (acceptedFiles) => {
      clearTokens();
      setDrops(
        acceptedFiles.map((file) => ({ file, loading: true, tokens: [] })),
      );

      for (const file of acceptedFiles) {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (!event.target?.result) {
            return;
          }

          const result = event.target.result as string;
          const tokens = getTokenMatchesForString(
            result,
            settings.includeLegacy,
          );

          setDrops((prev) =>
            prev.map((drop) =>
              drop.file === file ? { ...drop, loading: false, tokens } : drop,
            ),
          );
          addTokens(tokens);
        };

        reader.readAsText(file);
      }
    },
  });

  return (
    <section>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-8 cursor-pointer",
          isDragActive && "border-primary",
        )}
      >
        <Input {...getInputProps()} />

        <div className="grid place-items-center gap-4">
          <PiFilePlusDuotone
            className={cn(
              "h-12 w-12 text-primary",
              isDragActive && "animate-pulse",
            )}
          />
          <div className="text-center">
            <p className="font-light">
              {!isDragActive
                ? "Click here to select files or drop them here"
                : "Drop files here to load them"}
            </p>
            <small className="text-muted-foreground">
              Up to 10 text based files are supported (e.g. *.txt, *.csv,
              *.json, ...)
            </small>
          </div>
        </div>
      </Card>
      <div className="mt-4">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-1.5",
            drops.length > 0 && "mb-4",
          )}
        >
          {drops.map(({ file, loading, tokens }) => (
            <Card
              className="px-4 py-2 flex justify-between items-center"
              key={`imported-file-${file.name}`}
            >
              <div className="space-y-0.5">
                <h3 className="font-medium text-sm truncate max-w-[260px]">
                  {file.name}
                </h3>
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-1">
                    <PiFile className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-light">
                      {fileSizeToString(file.size)}
                    </span>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="h-[4px] w-[4px] rounded-full"
                  />
                  <div className="flex items-center space-x-1">
                    <PiUsersDuotone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-light">
                      {tokens.length} tokens
                    </span>
                  </div>
                </div>
              </div>
              {loading && <FiLoader className="animate-spin h-5 w-5" />}
              {!loading && (
                <Button
                  size="icon"
                  variant="default"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setDrops((prev) =>
                      prev.filter((drop) => drop.file !== file),
                    );
                    removeTokens(tokens);
                  }}
                >
                  <PiTrashDuotone className="h-4 w-4" />
                </Button>
              )}
            </Card>
          ))}
        </div>
        <div className="items-center flex space-x-1.5">
          {!isChecking && (
            <Button
              className="space-x-1.5"
              disabled={tokens.length === 0}
              onClick={() => start()}
            >
              <PiArrowsClockwiseDuotone className="h-4 w-4" />
              <span>Start Checking</span>
            </Button>
          )}
          {isChecking && (
            <Button
              disabled={pendingCancellation}
              className="space-x-1.5 bg-red-600 hover:bg-red-700"
              onClick={() => cancel()}
            >
              <PiStopDuotone className="w-4 h-4" />
              <span>Cancel Checking</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
