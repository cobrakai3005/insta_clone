"use client";
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Modal from "react-modal";
import { MdAddCircle } from "react-icons/md";
import { IoMdCamera } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "./Logo";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { timeStamp } from "console";

export default function Header() {
  const { data: session } = useSession();
  //   console.log(session);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [postUploading, setPostUploading] = useState(false);

  const [caption, setCaption] = useState("");
  const db = getFirestore(app);
  function addImageToPost(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setImgUrl(URL.createObjectURL(file));
        console.log(URL.createObjectURL(file));
      }
    }
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = async () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const filename = new Date().getTime() + "-" + selectedFile?.name;
    const storageRef = ref(storage, filename);
    if (selectedFile) {
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload us " + progress + "% done");
        },
        (error) => {
          console.log(error);
          setSelectedFile(null);
          setImageFileUploading(false);
          setImgUrl(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl(downloadURL);
            setImageFileUploading(false);
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    setPostUploading(true);
    const docRef = addDoc(collection(db, "posts"), {
      caption,
      profileImage: session?.user?.image,
      name: session?.user?.name,
      image: imgUrl,
      timeStamp: serverTimestamp(),
    });
    setPostUploading(false);
    setIsOpen(false);
  };
  return (
    <nav className="shadow-sm border border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <Logo />

        {/* Search input */}

        <input
          type="text"
          placeholder="Search"
          className="bg-gray50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[240px]"
        />
        {/* menu items */}

        {session ? (
          <div className="flex gap-3 items-center">
            <MdAddCircle
              size={26}
              className="text-red-400 cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-700"
              onClick={() => setIsOpen(true)}
            />
            <img
              width={56}
              height={56}
              className="rounded-full cursor-pointer"
              onClick={() => signOut()}
              src={session.user?.image || ""}
              alt={session.user?.name || ""}
            />
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm font-semibold text-blue-500"
          >
            Login
          </button>
        )}

        {isOpen && (
          <Modal
            isOpen={isOpen}
            className={
              "max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-300 shadow-md rounded-lg"
            }
            onRequestClose={() => setIsOpen(false)}
            ariaHideApp={false}
          >
            <h1 className="text-3xl text-center text-red-400 my-3 mx-4">
              Add Post
            </h1>
            <div className="flex flex-col justify-center items-center h-[100%]">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="selected Image"
                  className={`w-full h-[250px] object-cover cursor-pointer ${
                    imageFileUploading ? "animate-pulse" : ""
                  }`}
                  onClick={() => setImgUrl(null)}
                />
              ) : (
                <IoMdCamera
                  className="text-6xl text-gray-400 cursor-pointer hover:scale-125 transition duration-500"
                  onClick={() => filePickerRef.current?.click()}
                />
              )}

              <input
                type="file"
                hidden
                ref={filePickerRef}
                accept="image/*"
                onChange={addImageToPost}
              />
              {/* <button onClick={() => setIsOpen(false)}>Close</button> */}
            </div>
            <input
              type="text"
              maxLength={150}
              placeholder="Please enter you caption here.."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="m-4 border-none text-center  w-full focus:ring-0 py-4 outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={postUploading || !selectedFile || caption.trim() === ""}
              className="w-full bg-red-600 py-2 px-3 shadow-md rounded-md text-white hover:opacity-35 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-100"
            >
              Upload post
            </button>
            <AiOutlineClose
              className="cursor-pointer absolute top-2 right-2 text-xl hover:text-red-400 w-5 h-5 rounded-md"
              onClick={() => setIsOpen(false)}
            />
          </Modal>
        )}
      </div>
    </nav>
  );
}
