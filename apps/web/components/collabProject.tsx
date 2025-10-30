"use client";
import axios from "axios";
import {
  FolderCode,
  Clock3,
  Users,
  MoreVertical,
  SquarePen,
  Trash,
  X,
} from "lucide-react";

import { DateTime } from "next-auth/providers/kakao";
import React, { useState } from "react";
import { BASE_URL } from "../lib";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string;
  contributor: boolean;
  title: string;
  timeAgo: Date;
  language: string;
  members: number;
  roomName: string;
}

const CollabProject = ({
  id,
  title,
  roomName,
  timeAgo,
  language,
  members,
  contributor,
}: ProjectCardProps) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const router = useRouter();
  async function handleDelete(id: string) {
    const res = await axios.delete(`${BASE_URL}/api/collab`, {
      params: { id },
    });
    if (res.status == 200) {
      toast.success("deleted successfully");
      setDeleteModal(false);
      window.location.reload();
    } else {
      toast.error("couldnt delete the file");
      setDeleteModal(false);
    }
  }
  return (
    <div
      className={`relative bg-[#121826] border border-[#1E2533] rounded-xl ${deleteModal ? "p-0" : "p-4"} flex flex-col gap-3 hover:bg-[#1A2130] transition-colors duration-200 `}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
      {/* Top Row */}
      {deleteModal && (
        <div className="absolute bg-gray-500/20 backdrop-blur-md rounded-xl h-full w-full flex justify-center items-center flex-col gap-3">
          <p className="font-bold text-xl text-center">
            Are you sure you want to delete {title}?
          </p>
          <div className="flex gap-3">
            {" "}
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                Confirm
              </button>
              <button
                className="border border-gray-300 hover:border-gray-400 text-white hover:text-gray-900 hover:bg-white px-4 py-2 rounded-xl transition-all duration-200"
                onClick={() => setDeleteModal(false)}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center bg-[#5B4CEB1A] text-[#9F7AEA] rounded-md p-2">
          <FolderCode className="w-5 h-5" />
        </div>
        <div className="flex justify-between gap-3 ">
          <SquarePen
            className="text-purple-500 hover:scale-110 transition-all ease-linear"
            onClick={() => router.push(`/dashboard/collabs/${roomName}`)}
          />{" "}
          {contributor ? (
            ""
          ) : (
            <Trash
              className="text-red-400 hover:scale-110 transition-all ease-linear"
              onClick={() => setDeleteModal(true)}
            />
          )}
        </div>
      </div>

      {/* Title */}
      <div className="text-white text-lg font-semibold">{title}</div>

      {/* Meta info */}
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Clock3 className="w-4 h-4" />
        <span>{timeAgo.toLocaleString()}</span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-[#08C7DE] text-sm">{language}</span>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>{members}</span>
        </div>
      </div>
    </div>
  );
};

export default CollabProject;
