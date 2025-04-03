import React, { useEffect, useState } from "react";
import { FaBookOpen, FaPlus, FaFileDownload, FaUpload, FaTimes, FaTrash } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { storeService } from "../../api/storeService";

function StudyMaterial() {
  const { courseId }=useParams();
  const { user }=useSelector((state)=>state.user);
  const [course,setCourse]=useState(null);
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([]);

  const fetchData=async()=>{
    try {
      const res=await storeService.getAll({_id:courseId});
      if(res){
        if(res?.course) setCourse(res.course);
        if(res?.allresources) setMaterials(res.allresources);
      }
    } catch (error) {
      console.log(error);      
    }
  }

  const handleDelete=async(id)=>{
    try {
      const res=await storeService.deleteMaterial({_id:id});
      if(res){
        setMaterials((prev)=>prev.filter((item)=>item?._id!==id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Todo: uploading pending

  console.log(materials);
  console.log(course);

  useEffect(()=>{
    fetchData();
  },[]);
  
  
  return (
    <div className="min-h-screen flex-1 p-6 relative">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Study Materials: {course?.name || ""}</h2>
        <div className="mt-4">
          {materials.length > 0 ? (
            materials.map((material, index) => (
              <div key={material?._id} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2">
                <span className="text-gray-800 dark:text-gray-200">{material?.lecture + material?.part || 'Resource '+index}</span>
                <div className="flex items-center gap-4">
                  <a 
                    href={material?.resource || '#'} 
                    download
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <FaFileDownload /> Download
                  </a>
                  {user?.role==='faculty' && <button 
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
      {user?.role==='faculty' && <button 
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
            <input type="file" className="block w-full p-2 border rounded-lg" />
            <div className="mt-4 flex justify-between">
            <button 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center gap-2"
                onClick={() => setShowModal(false)}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 flex items-center gap-2"
              >
                <FaUpload /> Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyMaterial