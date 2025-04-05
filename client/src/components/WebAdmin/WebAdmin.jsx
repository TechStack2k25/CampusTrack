import React, { useState } from "react";
import { Modal } from "../Utils";
import { collegeService } from "../../api/collegeService";

const WebAdmin= () => {
  const [email,setEmail]=useState("");
  const [createdCollege, setCreatedCollege] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await collegeService.createCollege({email});
      if(res){
        setCreatedCollege(res);
        setEmail("");
      }
    } catch (err) {
      console.error("Error creating college:", err?.response?.data?.message || err.message);
      alert("Error creating college instance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">New College Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Admin Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Create College"}
        </button>
      </form>

      {createdCollege && (
        <Modal title="College Created" onClose={() => setCreatedCollege(null)}>
          <div className="text-gray-800 dark:text-white">
            <p><strong>Admin DB ID:</strong> {createdCollege?.admin}</p>
            <p className="mt-4 text-yellow-600 dark:text-yellow-400">
              📩 College Created and mail sent!
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WebAdmin;
