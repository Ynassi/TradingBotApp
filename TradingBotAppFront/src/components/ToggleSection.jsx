import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ToggleSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-4">
      {/* Titre + Chevron = Toggle */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold text-teal-300 m-0 leading-tight">{title}</h2>
        {open ? (
          <ChevronUp size={20} className="text-gray-300 align-middle" />
        ) : (
          <ChevronDown size={20} className="text-gray-300 align-middle" />
        )}
      </div>

      {/* Contenu visible seulement si ouvert */}
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
