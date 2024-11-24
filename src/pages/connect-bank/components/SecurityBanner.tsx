import React from 'react';
import { AlertCircle } from 'lucide-react';

export function SecurityBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
      <div className="flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-sm text-blue-700">
        Your security is our top priority. We use bank-level encryption and never store your 
        credentials. All data is transmitted using secure SSL connections.
      </p>
    </div>
  );
}