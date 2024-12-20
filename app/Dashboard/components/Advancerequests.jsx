import React, { useEffect, useState } from "react";
import supabase from "../../../lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon } from "../../../components/EyeIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Pagination } from "@nextui-org/react"; // NextUI Pagination Component
import { useAuth } from "../../../lib/AuthContext"; // assuming you have an AuthContext to get the user's role

export default function AdvanceRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [approvalState, setApprovalState] = useState(null);
  const [approverTitle, setApproverTitle] = useState("");
  const [approverEmail, setApproverEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5; 

  const { role, userEmail } = useAuth(); 

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("advance_requests")
        .select(`
          id,
          employee_code,
          status,
          advance_amount,
          repayment_period,
          reason_for_advance,
          employees!advance_requests_employee_code_fkey (
            name,
            email
          )
        `);

      if (error) {
        console.error("Error fetching advance requests:", error);
      } else {
        // Filter requests based on role
        const userRequests =
          role === "Employee"
            ? data.filter((request) => request.employees?.email === userEmail)
            : data; // HR and Admin see all requests

        setRequests(userRequests);
        setFilteredRequests(userRequests); // Initialize filtered requests
      }
    };

    fetchRequests();
  }, [role, userEmail]);

  // Filter requests based on search input
  useEffect(() => {
    setFilteredRequests(
      requests.filter((request) =>
        request.employees?.email?.toLowerCase().includes(searchEmail.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to the first page after filtering
  }, [searchEmail, requests]);

  const handleEyeClick = (request) => {
    setSelectedRequest(request);
    setIsOpen(true);
    setApprovalState(null);
    setApproverTitle("");
    setApproverEmail("");
  };

  const handleApproveClick = () => {
    setApprovalState("Approved");
  };

  const handleDeclineClick = () => {
    setApprovalState("Declined");
  };

  const handleCancelRequest = async () => {
    if (selectedRequest) {
      const { error } = await supabase
        .from("advance_requests")
        .update({ status: "Cancelled" })
        .eq("id", selectedRequest.id);

      if (error) {
        console.error("Error cancelling request:", error);
      } else {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: "Cancelled" } : req
          )
        );
        setIsOpen(false);
      }
    }
  };

  const handleSave = async () => {
    if (selectedRequest && approvalState) {
      const updatedStatus = approvalState;
      const { error } = await supabase
        .from("advance_requests")
        .update({ status: updatedStatus })
        .eq("id", selectedRequest.id);

      if (error) {
        console.error("Error updating request:", error);
      } else {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: updatedStatus } : req
          )
        );
        setIsOpen(false);
      }

      if (approverTitle && approverEmail) {
        const { error: approverError } = await supabase
          .from("approvers")
          .insert([
            {
              request_id: selectedRequest.id,
              title: approverTitle,
              email: approverEmail,
            },
          ]);

        if (approverError) {
          console.error("Error saving approver:", approverError);
        }
      }
    }
  };

  // Pagination calculation
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Advance Requests</h1>

        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by employee email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        <Table>
          <TableCaption>A list of all advance requests submitted by employees.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Employee Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Advance Amount</TableHead>
              <TableHead>Repayment Period</TableHead>
              <TableHead>Reason for Advance</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.employee_code}</TableCell>
                <TableCell>{request.employees?.name || "N/A"}</TableCell>
                <TableCell>{request.employees?.email || "N/A"}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === "Approved" ? "bg-green-100 text-green-700" :
                    request.status === "Declined" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.advance_amount.toLocaleString()}</TableCell>
                <TableCell>{request.repayment_period}</TableCell>
                <TableCell>{request.reason_for_advance}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <EyeIcon className="cursor-pointer" onClick={() => handleEyeClick(request)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total Requests: {filteredRequests.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            total={Math.ceil(filteredRequests.length / requestsPerPage)}
            initialPage={1}
            page={currentPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>

        {selectedRequest && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="h-full overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Request Details</SheetTitle>
                <SheetDescription>
                  Details for request ID: {selectedRequest.id}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <p><strong>Employee Code:</strong> {selectedRequest.employee_code}</p>
                <p><strong>Name:</strong> {selectedRequest.employees?.name || "N/A"}</p>
                <p><strong>Email:</strong> {selectedRequest.employees?.email || "N/A"}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Advance Amount:</strong> {selectedRequest.advance_amount.toLocaleString()}</p>
                <p><strong>Repayment Period:</strong> {selectedRequest.repayment_period}</p>
                <p><strong>Reason for Advance:</strong> {selectedRequest.reason_for_advance}</p>

                {/* Approval Status Path */}
                <div className="mt-4">
                  <h2 className="font-bold mb-2">Approval Status Path</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Approval Step</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Step 1: Initial Approval</TableCell>
                        <TableCell>Person A (Admin Dept, Manager)</TableCell>
                        <TableCell className="text-green-700">Approved</TableCell>
                        <TableCell>01/14/2024</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Step 2: Finance Review</TableCell>
                        <TableCell>Person B (Finance Office)</TableCell>
                        <TableCell className="text-yellow-700">Pending</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Step 3: Final Approval</TableCell>
                        <TableCell>Person C (Director)</TableCell>
                        <TableCell className="text-yellow-700">Pending</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <SheetFooter>
                {role === "HR" || role === "Admin" ? (
                  <>
                    <Button className="bg-green-500" onClick={handleApproveClick}>Approve</Button>
                    <Button className="bg-red-500" onClick={handleDeclineClick}>Deny</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsOpen(false)}>Okay</Button>


                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
