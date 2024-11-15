import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
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
// import { EyeIcon } from "../../components/EyeIcon";
// import { EditIcon } from "../../components/EditIcon";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select("*");
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-8 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">All Employees</h1>
        
        <Table>
          <TableCaption>A list of all employees in the payroll system.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Employee Code</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary-KSH</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employee_code}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={`/avatars/${employee.id.toLowerCase()}.svg`} alt="avatar" className="w-4 h-4 rounded-full" />
                    {employee.name}
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.status === "Full-time" ? "bg-green-100 text-green-700" :
                    employee.status === "Part-time" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>
                  {employee.salary}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    {/* <EyeIcon className="cursor-pointer" />
                    <EditIcon className="cursor-pointer" /> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Employees: {employees.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
