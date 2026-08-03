"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Result() {
  const status = useSearchParams().get("status");
  const success = status === "success";
  return <main style={{ maxWidth: 600, margin: "10vh auto", padding: 32, textAlign: "center" }}>
    <h1>{success ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}</h1>
    <p>{success ? "سفارش شما ثبت شد و پس از بررسی پردازش می‌شود." : "پرداخت تکمیل نشد. در صورت کسر وجه با پشتیبانی تماس بگیرید."}</p>
  </main>;
}

export default function PaymentResultPage() {
  return <Suspense fallback={<main style={{ padding: 32, textAlign: "center" }}>در حال بررسی پرداخت…</main>}><Result /></Suspense>;
}
