import React, { useEffect, useState } from "react";
import { FaBookOpen, FaPlus, FaFileDownload, FaUpload, FaTimes, FaTrash, FaSpinner } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { storeService } from "../../api/storeService";

function StudyMaterial() {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [course, setCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [otherData, setOtherData] = useState({ lecture: 1, part: 1 });

  const fetchData = async () => {
    try {
      const res = await storeService.getAll({ _id: courseId });
      if (res) {
        if (res?.course) setCourse(res.course);
        if (res?.allresources) setMaterials(res.allresources);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await storeService.deleteMaterial({ _id: id });
      if (res) {
        setMaterials((prev) => prev.filter((item) => item?._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handling file selection
  const handleFileChange = (event) => {
    console.log(event.target);

    setSelectedFile(event.target.files[0]);
  };

  const handleChange = (event) => {
    console.log(event.target);
    setOtherData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    })
  };

  // Handling file upload
  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      setUploading(true);
      const res = await storeService.addMaterial({ file: selectedFile, ...otherData, _id: courseId });

      if (res) {
        setOtherData({ lecture: 1, part: 1 });
        setSelectedFile(null);
        fetchData();
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);

    }
    finally {
      setUploading(false);
    }
  };

  // console.log(selectedFile);

  // console.log(materials);
  // console.log(course);

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="min-h-screen flex-1 p-6 relative">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Study Materials: {course?.name || ""}</h2>
        <div className="mt-4">
          {materials.length > 0 ? (
            materials.map((material, index) => (
              <div key={material?._id} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
                <span className="text-gray-800 dark:text-gray-200">{'Lecture: '+ material?.lecture+ '(' + material?.part +')' || 'Resource ' + index}</span>
                <div className="flex items-center gap-4">
                  <a
                    href={material?.resource || '#'}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <FaFileDownload /> Download
                  </a>
                  {user?.role === 'faculty' && <button
                    onClick={() => handleDelete(material._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-2"
                  >
                    <FaTrash />
                  </button>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No materials available.</p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {user?.role === 'faculty' && <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2"
      >
        <FaPlus />
      </button>}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 border p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Study Material</h2>
            {/* Lecture Number */}
            <div className="text-left mb-3">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Lecture
              </label>

              <input
                type="number"
                name="lecture"
                value={otherData?.lecture || 1}
                placeholder="Lecture Number"
                onChange={handleChange}
                className="block w-full p-2 border rounded-lg mb-3 text-black"
              />
            </div>

            {/* Part Number */}
            <div className="text-left mb-3">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Part
              </label>
              <input
                type="number"
                name="part"
                value={otherData?.part || 1}
                placeholder="Part Number"
                onChange={handleChange}
                className="block w-full p-2 border rounded-lg mb-3"
              />
            </div>

            {/* File Upload */}
            <input type="file" className="block w-full p-2 border rounded-lg dark:text-gray-300" onChange={handleFileChange} />
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center gap-2"
                onClick={() => setShowModal(false)}
              >
                <FaTimes /> Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 flex items-center gap-2"
                onClick={()=> !uploading && handleUpload()}
              >
                {uploading ?<div className="flex items-center gap-2"><FaSpinner className="animate-spin text-white text-xl" /> Uploading </div>:<div className="flex items-center gap-2"><FaUpload /> Upload</div>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyMaterial