"use client";

import { motion } from "framer-motion";
import { MoreVertical, ExternalLink } from "lucide-react";

const orders = [
  { id: "#ORD-7829", user: "الکس جانسون", platform: "اینستاگرام", service: "فالور", qty: "5,000", amount: "24,000 تومان", status: "تکمیل شده", date: "2 دقیقه پیش" },
  { id: "#ORD-7828", user: "سارا اسمیت", platform: "تلگرام", service: "عضو کانال", qty: "2,500", amount: "12,500 تومان", status: "در حال پردازش", date: "15 دقیقه پیش" },
  { id: "#ORD-7827", user: "مایک راس", platform: "تیک‌تاک", service: "بازدید", qty: "10,000", amount: "8,000 تومان", status: "در انتظار", date: "1 ساعت پیش" },
  { id: "#ORD-7826", user: "اما ویلسون", platform: "اینستاگرام", service: "لایک", qty: "1,000", amount: "5,000 تومان", status: "لغو شده", date: "3 ساعت پیش" },
  { id: "#ORD-7825", user: "جان دو", platform: "یوتیوب", service: "زمان تماشا", qty: "4,000", amount: "45,000 تومان", status: "تکمیل شده", date: "5 ساعت پیش" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "تکمیل شده": return <span className="badge badge-success">تکمیل شده</span>;
    case "در حال پردازش": return <span className="badge badge-primary">در حال پردازش</span>;
    case "در انتظار": return <span className="badge badge-warning">در انتظار</span>;
    case "لغو شده": return <span className="badge badge-error">لغو شده</span>;
    default: return <span className="badge">{status}</span>;
  }
};

export default function OrderTable() {
  return (
    <div className="table-container animate-fade-in" style={{ marginTop: "1rem" }}>
      <table>
        <thead>
          <tr>
            <th>شناسه سفارش</th>
            <th>کاربر</th>
            <th>سرویس</th>
            <th>تعداد</th>
            <th>مبلغ</th>
            <th>وضعیت</th>
            <th>تاریخ</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr 
              key={order.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td style={{ fontWeight: 600, color: "var(--primary)", direction: "ltr", textAlign: "right" }}>{order.id}</td>
              <td>{order.user}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>{order.platform}</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{order.service}</span>
                </div>
              </td>
              <td>{order.qty}</td>
              <td style={{ fontWeight: 600 }}>{order.amount}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td style={{ opacity: 0.6 }}>{order.date}</td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                    <ExternalLink size={18} />
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
