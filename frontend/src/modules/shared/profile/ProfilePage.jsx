
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import axios from "axios";
import { Loader2, Upload, Trash2, KeyRound } from "lucide-react";

const API = "http://localhost:5001/api/employees";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone: "",
    department: "",
    role: "Employee",
  });
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  const token = localStorage.getItem("token");
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/profile`, {
        headers: { "x-auth-token": token },
      });

      const data = res.data?.data || {};

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "",
        role: data.role || "Employee",
      });
      //added
      setAvatarPreview(data.avatar || null);

    } catch (err) {
      console.error("Profile load error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("department", profile.department);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axios.put(`${API}/profile`, formData, {
        headers: {
          "x-auth-token": token,
        },
      });

      alert("Profile updated successfully");

      setAvatarFile(null);
      loadProfile();

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating profile");
    }
  };
  const deleteAvatar = async () => {
    try {
      await axios.delete(`${API}/avatar`, {
        headers: { "x-auth-token": token },
      });

      setAvatarPreview(null);
      setAvatarFile(null);

      loadProfile();

    } catch (err) {
      console.error(err);
      alert("Failed to delete avatar");
    }
  };
  const changePassword = async () => {
    try {
      await axios.put(`${API}/change-password`, passwordData, {
        headers: { "x-auth-token": token },
      });

      alert("Password changed successfully");

      setPasswordData({
        current_password: "",
        new_password: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">

          <h2 className="fw-bold mb-3">My Profile</h2>

          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p>Loading profile...</p>
            </div>
          ) : (
            <>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-4 text-center">
                      <img
                        src={
                          avatarPreview ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        className="rounded-circle"
                        width="130"
                        height="130"
                        alt="avatar"
                        style={{ objectFit: "cover" }}
                      />

                      <input
                        type="file"
                        className="form-control mt-3"
                        onChange={handleAvatar}
                      />

                      <div className="d-flex justify-content-center gap-2 mt-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={updateProfile}
                        >
                          <Upload size={14} /> Upload
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={deleteAvatar}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="row g-3">

                        <div className="col-md-6">
                          <label>Name</label>
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Department</label>
                          <input
                            type="text"
                            name="department"
                            value={profile.department}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            onClick={updateProfile}
                          >
                            Update Profile
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">
                    <KeyRound size={18} /> Change Password
                  </h5>

                  <div className="row g-3">

                    <div className="col-md-6">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="form-control"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current_password: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="password"
                        placeholder="New Password"
                        className="form-control"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-success w-100"
                        onClick={changePassword}
                      >
                        Update Password
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </>
          )}

        </div>
      </PageContent>
    </div>
  );
};

export default ProfilePage;