import React, { useRef, useState } from "react";
import Button from "../ui/Button";
import { useTranslations } from "next-intl";
import { Trash } from "../ui/icons/Trash";
import Image from "next/image";
import UploadImg from "../ui/icons/UploadImg";
import AttachCircle from "../ui/icons/AttachCircle";
import Spinner from "../ui/icons/Spinner";

interface FileUploaderProps {
  label?: string;
  subdirName?: string;
  note?: string;
  onChange?: (filePath: string | null) => void;
  small?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label = "Logo Company",
  note = "Click on the image to change it. Note: Choose only JPG, PNG images and no more than 5MB in size.",
  onChange,
  subdirName = "common",
  small,
}) => {
  const t = useTranslations("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null); // Store uploaded file URL
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://api.imtyaaz.com/safety-point-academy";

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subdir", subdirName);

    try {
      setLoading(true);
      const response = await fetch("/api/upload?subdir=" + subdirName, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Upload response:", result);

      if (response.ok && result.success && result.innerData?.fileName) {
        const fullFileUrl = `${BASE_URL}${result.innerData.fileName}`; // Ensure absolute URL
        setFileUrl(fullFileUrl);
        if (onChange) {
          onChange(result.innerData?.fileName);
        }
      } else {
        alert(`File upload failed: ${result?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await uploadFile(droppedFile);
    }
  };

  const triggerFileInput = () => inputRef.current?.click();

  const handleDelete = () => {
    setFileUrl(null);
    if (onChange) onChange(null);
  };

  return (
    <div
      className={`relative ${
        small
          ? "rounded-lg text-gray-300 border border-gray-200 px-3 py-3.5 mt-5"
          : "rounded-lg border border-dashed border-opacity-30 border-gray-300 p-4"
      } ${
        dragging
          ? "bg-opacity-75 bg-gray-200"
          : "bg-opacity-30 bg-gray-201 hover:bg-opacity-60"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {small ? (
        <div
          className="flex items-center justify-between gap-2 overflow-hidden h-full cursor-pointer"
          onClick={triggerFileInput}
        >
          <span className="absolute bottom-full inputLabel start-0">
            {label}
          </span>
          {fileUrl ? (
            <div className="relative w-10 h-10 flex-none overflow-hidden -m-2">
              <Image
                src={`${fileUrl}`}
                alt="Safety Image Uploaded file"
                fill
                className="w-full h-full rounded-full object-cover cursor-pointer"
                onClick={triggerFileInput}
              />
            </div>
          ) : (
            <>
              {label}
              <span className="w-4">
                <AttachCircle />
              </span>
            </>
          )}
          {loading ? <Spinner /> : ""}
          {fileUrl && (
            <div className="ms-auto">
              <Button
                label={t("buttons.delete")}
                onClick={handleDelete}
                type="button"
                icon={
                  <span className="w-4 inline-block h-4">
                    <Trash />
                  </span>
                }
                variant="danger"
                padding="p-1"
                textSize="text-sm"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {fileUrl ? (
            <div className="relative w-20 h-20 flex-none overflow-hidden">
              <Image
                src={`${fileUrl}`}
                alt="Safety Image Uploaded file"
                fill
                className="w-full h-full rounded-full object-cover cursor-pointer"
                onClick={triggerFileInput}
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 bg-light-300 rounded-full flex items-center justify-center cursor-pointer flex-none"
              onClick={triggerFileInput}
            >
              {loading ? <Spinner /> : <UploadImg />}
            </div>
          )}

          {/* Text Content */}
          <div className="max-w-[335px]">
            <p className="text-sm font-medium text-gray-600 leading-normal">
              {label}
            </p>
            <p className="text-sm font-normal text-dark leading-normal mt-1">
              {note}
            </p>
          </div>
          {fileUrl && (
            <div className="ms-auto">
              <Button
                label={t("buttons.delete")}
                onClick={handleDelete}
                type="button"
                icon={
                  <span className="w-6 inline-block h-6">
                    <Trash />
                  </span>
                }
                variant="danger"
                padding="px-4 py-2"
                textSize="text-base"
              />
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
