import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Badge } from "@nextui-org/badge";
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
import { ArrowRightIcon, ChartBarIcon } from "@heroicons/react/solid"; // Use relevant icons

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const employees = [
  {
    name: "Jenny Wilson",
    email: "jennywilson@gmail.com",
    gross: "$10,310.00",
    taxes: "-$100.31",
    net: "$10,209.69",
    performance: "Good",
    status: "PAID",
  },
  {
    name: "Jane Cooper",
    email: "janecooper@gmail.com",
    gross: "$5,210.00",
    taxes: "-$521.00",
    net: "$4,689.00",
    performance: "Moderate",
    status: "PENDING",
  },
  {
    name: "Guy Hawkins",
    email: "guyhawkins@gmail.com",
    gross: "$3,120.00",
    taxes: "-$312.00",
    net: "$2,808.00",
    performance: "Good",
    status: "PAID",
  },
  {
    name: "Cody Fisher",
    email: "codyfisher@gmail.com",
    gross: "$7,500.00",
    taxes: "-$2,250.00",
    net: "$5,250.00",
    performance: "Poor",
    status: "UNPAID",
  },
];

const Stats = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Advance Requests over time ",
        data: [85, 90, 80, 95, 70, 100, 110, 95, 80, 75, 85, 100],
        backgroundColor: "#BC4749",
        borderRadius: 8,
      },
      {
        label: "Advance Money Disbursed",
        data: [15, 18, 14, 19, 12, 20, 22, 19, 14, 13, 16, 18],
        backgroundColor: "#386641",
        borderRadius: 8,
      },
      {
        label: "Repayment Rate",
        data: [70, 72, 66, 76, 58, 80, 88, 76, 66, 62, 69, 82],
        backgroundColor: "#A7C957",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex space-x-2">
          <Select defaultValue="Yearly">
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yearly">Yearly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <button className="btn btn-circle btn-primary">+</button>
          <button className="btn btn-circle btn-secondary">...</button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[{
            title: "New Net Income",
            value: "$53,765",
            change: "+10.5%",
            changeColor: "text-green-500",
            subtext: "$2,156 from last month",
          },
          {
            title: "Average Sales",
            value: "$12,680",
            change: "+3.4%",
            changeColor: "text-green-500",
            subtext: "$1,158 from last month",
          },
          {
            title: "Total Orders",
            value: "11,294",
            change: "-0.5%",
            changeColor: "text-red-500",
            subtext: "+1,450 from last month",
          }
        ].map((card, index) => (
          <Card key={index} className="p-2 shadow-md bg-green"> {/* Reduced padding to make the card smaller */}
            <CardHeader className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-500">{card.title}</span>
              <ChartBarIcon className="h-6 w-6 text-purple-500" /> {/* Using ChartBarIcon */}
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">{card.value}</h3>
                <span className={`text-sm ${card.changeColor}`}>{card.change}</span>
              </div>
              <p className="text-sm text-gray-500">{card.subtext}</p>
            </CardBody>
            <CardFooter className="flex justify-end">
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payroll Summary Chart */}
      <Card className="p-4 shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">Payroll Summary</h2>
        </CardHeader>
        <CardBody>
          <Bar data={data} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </CardBody>
      </Card>

      {/* Employee Summary Table */}
      <h1 className="text-2xl font-semibold">Recent Requests</h1>
      <Table>
        <TableCaption>Employee Salary and Performance Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Taxes</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.gross}</TableCell>
              <TableCell>{employee.taxes}</TableCell>
              <TableCell>{employee.net}</TableCell>
              <TableCell>
                <Badge color={employee.performance === "Good" ? "success" : employee.performance === "Moderate" ? "warning" : "error"}>
                  {employee.performance}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge color={employee.status === "PAID" ? "success" : employee.status === "PENDING" ? "warning" : "error"}>
                  {employee.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">$22,956.69</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Stats;
