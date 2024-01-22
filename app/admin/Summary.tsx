"use client";

import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { formatPrice } from "@/utils/formatePrice";
import { formatNumber } from "@/utils/formatNumbers";

interface SummaryProps {
  orders: Order[];
  products: Product[];
  users: User[];
}
type SummaryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};
export default function Summary({ orders, products, users }: SummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sale: {
      label: "Total Sale",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Paid Orders",
      digit: 0,
    },
    unpaidOrders: {
      label: "Unpaid Orders",
      digit: 0,
    },
    users: {
      label: "Total Users",
      digit: 0,
    },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      let tempData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if (item.status === "complete") {
          return acc + item.amount;
        } else {
          return acc;
        }
      }, 0);

      const paidOrders = orders.filter((order) => {
        return order.status === "complete";
      });

      const unpaidOrders = orders.filter((order) => {
        return order.status === "pending";
      });

      tempData.sale.digit = totalSale;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrders.length;
      tempData.unpaidOrders.digit = unpaidOrders.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;
      return tempData;
    });
  }, [orders, products, users]);

  //The data is object and we want it to be array to loop through it
  const summaryKeys = Object.keys(summaryData);

  return (
    <div className="max-w-[1150px] m-auto">
      <div className="mb-6 mt-8 ">
        <Heading title="S t a t s" center />
      </div>
      <div
        className="grid grid-cols-2 gap-3
         max-h-50vh overflow-y-auto"
      >
        {summaryKeys &&
          summaryKeys.map((key) => {
            return (
              <div
                key={key}
                className="rounded-xl border-2 p-4 flex
                  flex-col items-centr gap-2 transition"
              >
                <div className="text-xl md:text-4xl font-bold">
                  {summaryData[key].label === "Total Sale" ? (
                    <>{formatPrice(summaryData[key].digit)}</>
                  ) : (
                    <>{formatNumber(summaryData[key].digit)}</>
                  )}
                </div>
                <div>{summaryData[key].label}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}