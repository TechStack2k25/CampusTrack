import React, { useState } from "react";
import { useApprovals } from "../../data/approvals.js";
import ApprovalCard from "../Utils/ApprovalCard.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestService } from "../../api/requestService.js";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../store/slices/userSlice.js";
import Loading from "../Loading.jsx"

function Approvals() {
  // const [requests, setRequests] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     role: "Student",
  //     department: "Computer Science",
  //     email: "john.doe@example.com",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     role: "Faculty",
  //     department: "Mathematics",
  //     email: "jane.smith@example.com",
  //   },
  // ]);
  const { data: requests ,isLoading } = useApprovals();//may use isLoading and other error status
  const dispatch=useDispatch();
  console.log(requests)
  const queryClient = useQueryClient();

  const mutationToUpdateApproval = useMutation({
    mutationFn: requestService.updateRequest,
    onSuccess: (data) => {
      console.log('Approval handled successfully:', data);
      dispatch(setSuccess('Request Done!'));
      //invalidate allapprovals queries to refetch data
      queryClient.invalidateQueries(['allapprovals']); 
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message))
      console.error('Error in approval process:', error);
    }
  });

  const handleApprovalUpdate = (data) => {
    mutationToUpdateApproval.mutate(data);
  };


  return (
      <>
      {isLoading ?
      <div className="flex-1 bg-gray-100 min-h-screen">
          <Loading />
        </div>
      :
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Approval Requests</h1>
      {requests && requests?.length === 0 ? (
        <p className="text-center text-gray-600 mt-12 text-lg">
          No pending requests.
        </p>
      )
      :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests && requests?.length>0 && requests?.map((request) => <ApprovalCard key={request?._id} request={request} updatefn={handleApprovalUpdate}/>)}
    </div>}
    </div>
  }
  </>
  );
};

export default Approvals;
