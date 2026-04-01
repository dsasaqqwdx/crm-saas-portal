
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

const PoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/policies");
      setPolicies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  const filteredPolicies = policies.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">

          <h2 className="fw-bold mb-4">Company Policies</h2>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control mb-4"
            style={{ maxWidth: "300px" }}
          />

          {filteredPolicies.length === 0 ? (
            <p>No policies found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Added On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPolicies.map((p) => (
                    <tr key={p.id}>

                      <td>📄 {p.title}</td>

                      <td>Company Policy</td>

                      <td>
                        {p.created_at
                          ? new Date(p.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {/* ✅ FIXED VIEW */}
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            window.open(
                              `http://localhost:5001/api/policies/view/${p.file}`,
                              "_blank"
                            )
                          }
                        >
                          View
                        </button>

                        {/* ✅ DOWNLOAD */}
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `http://localhost:5001/uploads/policies/${p.file}`
                              );
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);

                              const link = document.createElement("a");
                              link.href = url;
                              link.download = p.title || "policy";

                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                              window.URL.revokeObjectURL(url);
                            } catch (err) {
                              console.error("Download error:", err);
                              alert("Download failed");
                            }
                          }}
                        >
                          Download
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </PageContent>
    </div>
  );
};

export default PoliciesPage;