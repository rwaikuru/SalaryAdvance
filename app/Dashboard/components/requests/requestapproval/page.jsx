import React from 'react';
import { Button } from "@/components/ui/button"

const SalaryAdvanceApproval = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          View Salary Advance Request Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section - Request Details */}
          <div>
            <h3 className="text-lg font-semibold">Salary Advance Request Details</h3>
            <p><strong>Request ID:</strong> 2024-SA-001</p>
            <p><strong>Employee Name:</strong> Jane Doe</p>
            <p><strong>Requested Amount:</strong> KES 50,000</p>
            <p><strong>Status:</strong> Pending</p>
            <p><strong>Submission Date:</strong> October 15, 2024</p>
            <p><strong>Purpose/Description:</strong> Salary advance for personal expenses</p>
            
            {/* Attached Documents */}
            <h4 className="text-lg font-semibold mt-4">Attached Documents</h4>
            <p>Salary Slip, Bank Statement</p>
            <div className="flex space-x-4 mt-2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">View</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Download</Button>
            </div>
          </div>
          
          {/* Right Section - Approval Status Path */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Approval Status Path</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-left">
                <thead>
                  <tr>
                    <th className="border-b p-2">Approval Step</th>
                    <th className="border-b p-2">Approver</th>
                    <th className="border-b p-2">Status</th>
                    <th className="border-b p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b p-2">Step 1: Initial Approval</td>
                    <td className="border-b p-2">Person A (Admin Dept, Manager)</td>
                    <td className="border-b p-2 text-green-600">Approved</td>
                    <td className="border-b p-2">01/14/2024</td>
                  </tr>
                  <tr>
                    <td className="border-b p-2">Step 2: Finance Review</td>
                    <td className="border-b p-2">Person B (Finance Office)</td>
                    <td className="border-b p-2 text-yellow-600">Pending</td>
                    <td className="border-b p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border-b p-2">Step 3: Final Approval</td>
                    <td className="border-b p-2">Person C (Director)</td>
                    <td className="border-b p-2 text-yellow-600">Pending</td>
                    <td className="border-b p-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center mt-6">
          <Button className="bg-green-500 hover:bg-green-600 text-white">Okay</Button>
        </div>
      </div>
    </div>
  );
};

export default SalaryAdvanceApproval;
