import React, { useState } from 'react';
import { Modal } from '../Utils';
import { collegeService } from '../../api/collegeService';

const WebAdmin = () => {
  const [email, setEmail] = useState('');
  const [createdCollege, setCreatedCollege] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await collegeService.createCollege({ email });
      if (res) {
        setCreatedCollege(res);
        setEmail('');
      }
    } catch (err) {
      alert('❌ Error creating college instance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        New College Setup
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@college.edu"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 font-medium disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Create College'}
        </button>
      </form>

      {createdCollege && (
        <Modal title="✅ College Created" onClose={() => setCreatedCollege(null)}>
          <div className="text-gray-800 dark:text-white space-y-2">
            <p>
              <strong>Admin DB ID:</strong> {createdCollege?.admin}
            </p>
            <p className="text-yellow-600 dark:text-yellow-400">
              📩 A confirmation email has been sent!
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WebAdmin;
