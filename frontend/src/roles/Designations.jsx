import React, { useEffect, useState } from "react";
import axios from "axios";
const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [designationName, setDesignationName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const fetchDesignations = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/designations");
      setDesignations(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchDesignations();
  }, []);
  const addDesignation = async () => {
    if (!designationName || !companyId) {
      return alert("Please enter both designation name and company ID");
    }

    try {
      await axios.post("http://localhost:5001/api/designations", {
        designation_name: designationName,
        company_id: parseInt(companyId),
      });

      setDesignationName("");
      setCompanyId("");
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Failed to add designation");
    }
  };
  const deleteDesignation = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/designations/${id}`);
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Failed to delete designation");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Designations</h2>
      <div className="row mb-3">
        <div className="col-md-5 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter designation"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Enter company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-2">
          <button className="btn btn-primary w-100" onClick={addDesignation}>
            Add
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Designation Name</th>
              <th>Company ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designations.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No designations found
                </td>
              </tr>
            ) : (
              designations.map((d) => (
                <tr key={d.designation_id}>
                  <td>{d.designation_id}</td>
                  <td>{d.designation_name}</td>
                  <td>{d.company_id}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteDesignation(d.designation_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Designations;