import React from 'react';

export default function PlaceholderPage({ title }) {
  return (
    <div className="card h-full flex items-center justify-center">
      <div className="text-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-muted">{title}</h2>
        <p className="text-muted">This page is under construction.</p>
      </div>
    </div>
  );
}
