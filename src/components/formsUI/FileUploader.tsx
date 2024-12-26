import React, { useRef, useState } from "react";
import Button from "../ui/Button";
import { useTranslations } from "next-intl";
import { Trash } from "../ui/icons/Trash";

interface FileUploaderProps {
  label?: string; // Optional label
  note?: string; // Optional note
  onChange?: (file: File | null) => void; // Callback when a file is selected
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label = "Logo Company",
  note = "Click on the image to change it Note: Choose only JPG, PNG images and no more than 5MB in size",
  onChange,
}) => {
  const t = useTranslations("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (onChange) {
      onChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (onChange) {
        onChange(droppedFile);
      }
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    setFile(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div
      className={`relative rounded-lg border border-dashed border-opacity-30 border-gray-300 p-4 ${
        dragging ? "bg-opacity-75 bg-gray-200" : "bg-opacity-30 bg-gray-201"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Content */}
      <div className="flex items-center gap-3">
        {file ? (
          <div className="relative w-20 h-20 flex-none overflow-hidden">
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded file"
              className="w-full h-full rounded-full object-cover cursor-pointer"
              onClick={triggerFileInput}
            />
          </div>
        ) : (
          <div
            className="w-20 h-20 bg-light-300 rounded-full flex items-center justify-center cursor-pointer flex-none"
            onClick={triggerFileInput}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2679 5.16714H12.1598C8.81995 5.16714 6.10047 7.88662 6.10047 11.2265V23.1671H5.53317C4.40639 23.1671 3.4992 22.26 3.4992 21.1332V5.53317C3.4992 4.40639 4.40639 3.4992 5.53317 3.4992H11.2665C12.2683 3.4992 13.0964 4.21624 13.2679 5.16714Z"
                fill="#8E8E8E"
                stroke="#8E8E8E"
                strokeWidth="1.66539"
              />
              <path
                d="M29.3329 5.53317V21.1332C29.3329 22.7198 28.0529 23.9998 26.4662 23.9998H25.6262C25.3729 23.9998 25.1595 23.7865 25.1595 23.5332V11.2265C25.1595 8.3465 22.8129 5.99984 19.9329 5.99984H18.3329C18.0795 5.99984 17.8662 5.7865 17.8662 5.53317C17.8662 3.9465 19.1462 2.6665 20.7329 2.6665H26.4662C28.0529 2.6665 29.3329 3.9465 29.3329 5.53317Z"
                fill="#8E8E8E"
              />
              <path
                d="M19.9336 8H12.1603C10.3736 8 8.93359 9.44 8.93359 11.2267V26.1067C8.93359 27.8933 10.3736 29.3333 12.1603 29.3333H14.3336C14.7069 29.3333 15.0003 29.04 15.0003 28.6667V25.3333C15.0003 24.7867 15.4536 24.3333 16.0003 24.3333C16.5469 24.3333 17.0003 24.7867 17.0003 25.3333V28.6667C17.0003 29.04 17.2936 29.3333 17.6669 29.3333H19.9469C21.7203 29.3333 23.1603 27.8933 23.1603 26.12V11.2267C23.1603 9.44 21.7203 8 19.9336 8ZM18.6669 19.6667H13.3336C12.7869 19.6667 12.3336 19.2133 12.3336 18.6667C12.3336 18.12 12.7869 17.6667 13.3336 17.6667H18.6669C19.2136 17.6667 19.6669 18.12 19.6669 18.6667C19.6669 19.2133 19.2136 19.6667 18.6669 19.6667ZM18.6669 15.6667H13.3336C12.7869 15.6667 12.3336 15.2133 12.3336 14.6667C12.3336 14.12 12.7869 13.6667 13.3336 13.6667H18.6669C19.2136 13.6667 19.6669 14.12 19.6669 14.6667C19.6669 15.2133 19.2136 15.6667 18.6669 15.6667Z"
                fill="#B34254"
              />
            </svg>
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
        {file && (
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

      {/* Hidden File Input */}
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
