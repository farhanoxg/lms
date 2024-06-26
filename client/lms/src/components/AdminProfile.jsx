import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const AdminProfile = () => {
  const { logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile/adminprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await res.json();
        console.log("AdminProfile", result);

        if (res.ok) {
          setProfile(result);
        } else {
          throw new Error(result.msg);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center text-gray-700">Loading admin profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Admin Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{profile.role} Profile</h2>
        <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
        <p className="mb-4"><strong>Email:</strong> {profile.email}</p>
      </div>
      <button
        onClick={logoutUser}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
