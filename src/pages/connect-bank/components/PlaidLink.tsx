import { Link2 } from 'lucide-react';
import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkProps {
  linkToken: string | null;
  onSuccess: (publicToken: string) => void;
}

export function PlaidLink({ linkToken, onSuccess }: PlaidLinkProps) {
  const [, setError] = useState<string | null>(null);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token) => {
      onSuccess(public_token);
    },
    onExit: (err, metadata) => {
      if (err) setError(err.display_message || 'An error occurred');
      console.log('Exit:', metadata);
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready || !linkToken}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg
                 shadow-lg transform transition-all duration-200 hover:scale-105 
                 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Link2 className="w-5 h-5" />
      <span>Connect Your Bank Account</span>
    </button>
  );
}