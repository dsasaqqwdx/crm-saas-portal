
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

const PoliciesPage = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [policies, setPolicies] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/policies");
      setPolicies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    try {
      if (!title || !file) {
        alert("Enter title & file");
        return;
      }

      if (!token) {
        alert("Please login again");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      await axios.post(
        "http://localhost:5001/api/policies/upload",
        formData,
        {
          headers: {
            "x-auth-token": token, // ✅ IMPORTANT FIX
          },
        }
      );

      alert("Uploaded successfully");
      setTitle("");
      setFile(null);
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || err.response?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!token) {
        alert("Please login again");
        return;
      }

      await axios.delete(
        `http://localhost:5001/api/policies/${id}`,
        {
          headers: {
            "x-auth-token": token, // ✅ also protect delete if backend requires
          },
        }
      );

      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <PageContent>
        <div className="container-fluid px-4 py-4">

          <h3 className="fw-bold mb-4">Company Policies</h3>

          <div className="card shadow-sm p-3 mb-4">
            <div className="row g-3">

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Policy Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleUpload}
                >
                  Upload Policy
                </button>
              </div>

            </div>
          </div>

          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover">

                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Added On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {policies.map((p) => (
                    <tr key={p.id}>
                      <td>📄 {p.title}</td>

                      <td>
                        {p.created_at
                          ? new Date(p.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        <a
                          href={`http://localhost:5001/uploads/policies/${p.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          View
                        </a>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </PageContent>
    </div>
  );
};

export default PoliciesPage;