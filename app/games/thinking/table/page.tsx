"use client";

import { useState } from "react";
import Level1 from "./levels/level1";
import Level2 from "./levels/level2";

export default function TablePage() {
  const [level, setLevel] = useState(1);

  return (
    <>
      {level === 1 && (
        <Level1 />
      )}

      {level === 2 && (
        <Level2 />
      )}

      {level === 1 && (
        <button
          onClick={() => setLevel(2)}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-emerald-500 px-8 py-4 font-black text-white shadow-2xl"
        >
          ادامه به مرحله ۲
        </button>
      )}
    </>
  );
}