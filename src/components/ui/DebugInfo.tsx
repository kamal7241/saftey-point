"use client";
import { useState } from "react";

export default function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false);

  const debugInfo = {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NODE_ENV: process.env.NODE_ENV,
    API_URL: `${process.env.NEXT_PUBLIC_URL}/api/v1/currency/test`,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
      >
        Debug Info
      </button>
      
      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <div className="text-xs space-y-1">
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span className="text-gray-600 break-all">{value || "undefined"}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowDebug(false)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
} 