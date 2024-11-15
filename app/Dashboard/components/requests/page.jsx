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
import { EyeIcon } from "../../../../components/EyeIcon";
import { EditIcon } from "../../../components/EditIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Pagination } from "@nextui-org/react"; // NextUI Pagination Component

export default function AdvanceRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [approvalState, setApprovalState] = useState(null);
  const [approverTitle, setApproverTitle] = useState("");
  const [approverEmail, setApproverEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState(""); // For search input
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5; // Number of requests per page

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
        setRequests(data);
        setFilteredRequests(data); // Initialize filtered requests
      }
    };

    fetchRequests();
  }, []);

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
        setApprovalState(null);
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
                    <EditIcon className="cursor-pointer" />
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
            <SheetContent side="right">
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

                <div className="mt-4">
                  <label className="block text-sm font-medium">Approver's Title</label>
                  <Input
                    type="text"
                    placeholder="Enter approver's title"
                    value={approverTitle}
                    onChange={(e) => setApproverTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium">Approver's Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter approver's email address"
                    value={approverEmail}
                    onChange={(e) => setApproverEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
