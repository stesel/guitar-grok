import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  );
}
