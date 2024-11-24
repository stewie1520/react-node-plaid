import React from 'react';
import { CheckCircle } from 'lucide-react';

const features = [
  'Secure bank-level encryption',
  'Quick and easy setup process',
  'Access to detailed financial insights',
  'Automated transaction tracking'
];

export function FeatureList() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Why Connect Your Account?
      </h2>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}