import React, { useRef, useState } from "react";
import Button from "../ui/Button";
import { useTranslations } from "next-intl";
import { Trash } from "../ui/icons/Trash";
import Image from "next/image";
import UploadImg from "../ui/icons/UploadImg";
import AttachCircle from "../ui/icons/AttachCircle";
import Spinner from "../ui/icons/Spinner";
import ImageWithFallback from "../ui/ImageWithFallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faFilePdf, faFileWord, faFilePowerpoint, faFileExcel, faFileText } from "@fortawesome/free-solid-svg-icons";

interface FileUploaderProps {
  label?: string;
  subdirName?: string;
  note?: string;
  onChange?: (filePath: string | null) => void;
  small?: boolean;
  initialImageUrl?: string | null;
  isDocumentUploader?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label = "Logo",
  note = "Click on the image to change it. Note: Choose only JPG, PNG images and no more than 5MB in size.",
  onChange,
  subdirName = "common",
  small,
  initialImageUrl = null,
  isDocumentUploader = false,
}) => {
  const t = useTranslations("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(initialImageUrl);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_URL || "";

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="w-8 h-8 duotone-icon duotone-danger" />;
      case 'doc':
      case 'docx':
        return <FontAwesomeIcon icon={faFileWord} className="w-8 h-8 duotone-icon duotone-info" />;
      case 'ppt':
      case 'pptx':
        return <FontAwesomeIcon icon={faFilePowerpoint} className="w-8 h-8 duotone-icon duotone-warning" />;
      case 'xls':
      case 'xlsx':
        return <FontAwesomeIcon icon={faFileExcel} className="w-8 h-8 duotone-icon duotone-success" />;
      case 'txt':
        return <FontAwesomeIcon icon={faFileText} className="w-8 h-8 duotone-icon duotone-secondary" />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="w-8 h-8 duotone-icon duotone-secondary" />;
    }
  };

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
        const fullFileUrl = `${BASE_URL}${result.innerData.fileName?.startsWith("/") ? "" : "/"
          }${result.innerData.fileName}`;
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

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'File';
  };

  return (
    <div
      className={`relative ${small
          ? "rounded-lg text-gray-300 border border-gray-200 px-3 py-auto mt-[26px] leading-[50px]"
          : "rounded-lg border border-dashed border-opacity-30 border-gray-300 p-4"
        } ${dragging
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
          className="flex h-full min-h-[50px] cursor-pointer items-center justify-between gap-2 overflow-hidden"
          onClick={triggerFileInput}
        >
          <span className="inputLabel absolute bottom-full start-0">
            {label}
          </span>
          {fileUrl ? (
            <div className="flex h-[50px] w-full items-center justify-center">
              <div className="relative h-7 w-7 flex-none overflow-hidden">
                {isDocumentUploader ? (
                  <div className="flex items-center justify-center h-full w-full">
                    {getFileIcon(getFileName(fileUrl))}
                  </div>
                ) : (
                  <Image
                    src={`${fileUrl}`}
                    alt="Safety Image Uploaded file"
                    fill
                    className="h-full w-full cursor-pointer rounded-full object-cover"
                    onClick={triggerFileInput}
                  />
                )}
              </div>

              <div className="ms-auto">
                <Button
                  onClick={handleDelete}
                  type="button"
                  icon={
                    <span className="inline-block h-4 w-4 text-white">
                      <Trash />
                    </span>
                  }
                  variant="danger"
                  padding="p-1"
                  textSize="text-sm"
                />
              </div>
            </div>
          ) : (
            <>
              {!loading && (
                <div className="flex w-full items-center justify-between gap-2">
                  {label}
                  <span className="inline-block w-4">
                    <AttachCircle />
                  </span>
                </div>
              )}
            </>
          )}
          {loading ? (
            <div className="ms-auto">
              <Spinner />
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {fileUrl ? (
            <div className="relative h-20 w-20 flex-none overflow-hidden">
              {isDocumentUploader ? (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
                  {getFileIcon(getFileName(fileUrl))}
                </div>
              ) : (
                <ImageWithFallback
                  src={`${fileUrl}`}
                  alt="Safety Image Uploaded file"
                  width={70}
                  height={70}
                  className="rounded-full object-cover w-20 h-20"
                />
              )}
            </div>
          ) : (
            <div
              className="flex h-20 w-20 flex-none cursor-pointer items-center justify-center rounded-full bg-light-300"
              onClick={triggerFileInput}
            >
              {loading ? <Spinner /> : <UploadImg />}
            </div>
          )}

          {/* Text Content */}
          <div className="max-w-[335px]">
            <p className="text-sm font-medium leading-normal text-gray-600">
              {label}
            </p>
            <p className="mt-1 text-sm font-normal leading-normal text-dark">
              {note}
            </p>
            {fileUrl && isDocumentUploader && (
              <p className="mt-1 text-xs text-gray-500">
                {getFileName(fileUrl)}
              </p>
            )}
          </div>
          {fileUrl && (
            <div className="ms-auto">
              <Button
                label={t("buttons.delete")}
                onClick={handleDelete}
                type="button"
                icon={
                  <span className="inline-block h-6 w-6 text-white">
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
        accept={isDocumentUploader ? "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain" : "image/*,application/pdf"}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
