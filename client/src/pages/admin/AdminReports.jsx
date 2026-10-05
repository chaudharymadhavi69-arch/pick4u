// import React, { useEffect, useState } from "react";
// import { getOrderReport, getRevenueReport } from "../../api";

// export default function AdminReports() {
//   const [orders, setOrders] = useState([]);
//   const [revenue, setRevenue] = useState([]);

//   useEffect(() => {
//     getOrderReport().then((res) => setOrders(res.data));
//     getRevenueReport().then((res) => setRevenue(res.data));
//   }, []);

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div>
//         <h2 className="text-xl font-bold mb-2">Order Reports</h2>
//         <pre className="bg-gray-100 p-3 rounded">
//           {JSON.stringify(orders, null, 2)}
//         </pre>
//       </div>
//       <div>
//         <h2 className="text-xl font-bold mb-2">Revenue Reports</h2>
//         <pre className="bg-gray-100 p-3 rounded">
//           {JSON.stringify(revenue, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }
import React from "react";

const AdminReports = () => {
  return <div>AdminReports</div>;
};

export default AdminReports;
