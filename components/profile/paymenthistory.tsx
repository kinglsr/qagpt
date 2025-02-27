"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { getpayments } from "@/lib/actions/payments.action";
import getMongoUserId from "@/components/shared/GetMongouserDetails";

const PurchaseTable = () => {
  const [userID, setUserID] = useState<string | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [payments, setPayments] = useState<any[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getMongoUserId();
      setUserID(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      if (userID) {
        const res = await getpayments({ userId: userID as string });
        setPayments(res.payments);
        setLoading(false);
      }
    };
    if (userID) {
      fetchPayments();
    }
  }, [userID]);

  return (
    <div className="my-5 overflow-x-auto">
      <div>
        <h2 className="h2-bold text-dark100_light900">Payment History</h2>
      </div>
      <Table className="w-full rounded-lg bg-primary-500 text-center">
        <TableCaption className="dark:bg-gray-800">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3">Product name</TableHead>
            <TableHead className="px-4 py-3">Purchased Date</TableHead>
            <TableHead className="px-4 py-3">Price</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Session</TableHead>
            <TableHead className="px-4 py-3">Started</TableHead>
            <TableHead className="px-4 py-3">Ended</TableHead>
            {payments.some((session) => session.invoice) && (
              <TableHead className="px-4 py-3 text-center">View</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="whitespace-nowrap p-4 text-left font-medium text-gray-900 dark:text-white">
          {payments.map((session, index) => (
            <TableRow
              key={index}
              className="border-b bg-white uppercase hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <TableCell>{session.line_items.data[0].description}</TableCell>
              <TableCell className="p-4">
                {new Date(session.created * 1000).toLocaleDateString()}
              </TableCell>
              <TableCell className="p-4">
                {session.amount_total / 100}
              </TableCell>
              <TableCell className="p-4">{session.payment_status}</TableCell>

              <TableCell className="p-4">{session.session_vgpt}</TableCell>
              <TableCell className="p-4">
                {session.session_vgpt === "new" ? (
                  "-"
                ) : (
                  <>{session.session_start.toLocaleString()}</>
                )}
              </TableCell>
              <TableCell className="p-4">
                {session.session_vgpt === "completed" ? (
                  <>{session.session_end.toLocaleString()}</>
                ) : (
                  "-"
                )}
              </TableCell>
              {session.invoice && (
                <TableCell className="p-4 text-center">
                  <a
                    href={session.invoice.hosted_invoice_url}
                    target="_blank"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    VIEW
                  </a>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseTable;
