import React, { useState } from 'react';
export default function InfoAccordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition text-teal-400 font-semibold"
      >
        {title} {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="bg-gray-900 mt-2 p-4 rounded-lg text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}