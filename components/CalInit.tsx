"use client";

import Script from "next/script";

export default function CalInit() {
  return (
    <Script
      id="cal-init"
      src="https://app.cal.com/embed/embed.js"
      strategy="lazyOnload"
      onReady={() => {
        const w = window as any;
        if (w.Cal) {
          w.Cal("init", "15min", { origin: "https://cal.com" });
          w.Cal.ns["15min"]("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        }
      }}
    />
  );
}
