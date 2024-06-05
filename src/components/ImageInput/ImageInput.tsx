"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FC,
  HTMLProps,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import classes from "./ImageInput.module.scss";
import { IDiaryNoteDecrypted } from "@/models/IDiaryNoteDecrypted";
import encryptMedia from "@/actions/encryptMedia";
import * as crypto from "crypto";
import revalidateDiary from "@/actions/revalidateDiary";

interface IImageInputProps extends HTMLProps<HTMLDivElement> {
  note: IDiaryNoteDecrypted | undefined;
}

function hexStringToBlob(hexString: string, mimeType: string) {
  const matches = hexString.match(/.{1,2}/g);
  if (!matches) {
    throw new Error("Invalid hex string format");
  }
  const arrayBuffer = new Uint8Array(matches.map((byte) => parseInt(byte, 16)))
    .buffer;
  return new Blob([arrayBuffer], { type: mimeType });
}

const ImageInput: FC<IImageInputProps> = ({ note, ...props }) => {
  useEffect(() => {
    if (!note) return;
    note.diaryNoteMedia.forEach((media) => {
      if (!media.mediaPath) return;
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `${process.env.NEXT_PUBLIC_API_URL}/static/${media.mediaPath}?iv=${media.mediaIVHex}`,
        true
      );
      xhr.withCredentials = true;
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const filename =
            media.mediaPath.lastIndexOf("/") === -1
              ? media.mediaPath
              : media.mediaPath.substring(media.mediaPath.lastIndexOf("/") + 1);
          const file = new File([blob], filename, { type: blob.type });
          setFiles((prev) => {
            if (prev.find((f) => f.name === file.name)) {
              return prev;
            }
            return [...prev, file];
          });
        } else {
          setUploadError("Something went wrong while loading images");
        }
      };
      xhr.send();
    });
  }, [note]);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (
          files.find((f) => f.name === file.name) ||
          !file.type.startsWith("image")
        ) {
          continue;
        }
        setFiles((prev) => [...prev, file]);
      }
    }
  };

  const handleImageClick = (e: MouseEvent<HTMLDivElement>, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles((prev) => prev.filter((_, index) => index !== i));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        if (
          files.find((f) => f.name === file.name) ||
          !file.type.startsWith("image")
        ) {
          continue;
        }
        setFiles((prev) => [...prev, file]);
      }
    }
  };

  const handleUpload = async () => {
    if (!note) {
      return;
    }
    setUploading(true);
    const deleteExistingMedia = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/all/${note._id}`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );

    if (!deleteExistingMedia.ok) {
      setUploadError("Something went wrong");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const iv = crypto.randomBytes(16).toString("hex");
      const dataToEncrypt = new FormData();
      dataToEncrypt.append("file", file);
      dataToEncrypt.append("iv", iv);
      const encryptedData = await encryptMedia(dataToEncrypt);

      if (!encryptedData) {
        setUploadError("Something went wrong");
        return;
      }
      const encryptedBlob = hexStringToBlob(
        encryptedData.file,
        encryptedData.mimeType
      );
      const encryptedFile = new File([encryptedBlob], encryptedData.name, {
        type: encryptedData.mimeType,
      });
      const formData = new FormData();
      formData.append("file", encryptedFile);
      formData.append("noteId", note._id);
      formData.append("iv", iv);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/upload/`,
        {
          credentials: "include",
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setUploadError("Something went wrong");
        return;
      }
    }
    setUploading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
    setFiles([]);
    revalidateDiary();
  };

  return (
    <div
      className={`${classes.container}${
        props.className ? " " + props.className : ""
      }`}
      {...props}
    >
      <label className={classes.label} htmlFor={`${note?.title}_${note?._id}`}>
        <p>Upload images</p>
        {uploading && <p className={classes.uploading}>Uploading...</p>}
        {uploadError && <p className={classes.error}>{uploadError}</p>}
        {success && <p className={classes.success}>Uploaded successfully</p>}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={classes.images}
        >
          {files.length > 0 &&
            files.map((file) => (
              <Image
                onClick={(e) => handleImageClick(e, files.indexOf(file))}
                className={classes.image}
                src={URL.createObjectURL(file)}
                alt="Uploaded image"
                key={file.name}
                width={200}
                height={200}
              />
            ))}
        </div>
      </label>
      <input
        className={classes.input}
        type="file"
        multiple
        id={`${note?.title}_${note?._id}`}
        onChange={handleInputFiles}
      />
      {files.length > 0 && (
        <div className={classes.buttons}>
          <button
            className={classes.button}
            onClick={() => setFiles([])}
            type="button"
          >
            Clear
          </button>
          <button
            className={classes.button}
            onClick={handleUpload}
            type="button"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
