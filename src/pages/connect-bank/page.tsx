import { Loader, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FeatureList } from './components/FeatureList';
import { PlaidLink } from './components/PlaidLink';
import { SecurityBanner } from './components/SecurityBanner';
import { SuccessState } from './components/SuccessState';
import { useCommandCreateLinkToken, useCommandExchangePublicToken, useQueryIsLinked } from '../../hooks/apis';

function ConnectBankPage() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: isLinked, isLoading: isCheckingLinked } = useQueryIsLinked();
  const { mutateAsync: createLinkToken, isPending: isCreatingLinkToken } = useCommandCreateLinkToken();
  const { mutateAsync: exchangePublicToken, isPending: isExchangingPublicToken } = useCommandExchangePublicToken();

  useEffect(() => {
    if (isLinked || isLinked === undefined) {
      setIsConnected(true);
      return;
    }

    const fetchLinkToken = async () => {
      try {
        const linkToken = await createLinkToken();
        setLinkToken(linkToken);
      } catch {
        setError('Failed to fetch link token');
      }
    };

    fetchLinkToken();
    setIsConnected(false);
  }, [isLinked, createLinkToken]);

  const handlePlaidSuccess = async (publicToken: string) => {
    await exchangePublicToken(publicToken);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {error && (
        <div className='fixed bottom-0 left-0 w-full px-5 py-1 flex items-center bg-red-500/90'>
          <p className='text-white'><div className='animate-bounce inline-block'>😔</div> {error}</p>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg
                          flex items-center justify-center">
            <LockKeyhole className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Bank Account
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Securely link your bank account using Plaid's trusted platform.
            Your data is encrypted and protected.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureList />
            <div className="flex flex-col items-center justify-center space-y-6">
              {isCreatingLinkToken || isCheckingLinked ? (
                <div
                  className="bg-white hover:bg-white text-blue-500 border font-semibold py-3 px-6 rounded-lg
                            shadow-lg transform transition-all duration-200 hover:scale-105 
                            flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Checking Status</span>
                </div>
              ) : 
                isExchangingPublicToken ? (
                  <div
                    className="bg-white hover:bg-white text-blue-500 border font-semibold py-3 px-6 rounded-lg
                              shadow-lg transform transition-all duration-200 hover:scale-105 
                              flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Finishing Connection</span>
                  </div>
                ) :
                isConnected ? (
                  <SuccessState />
                ) : (
                  <PlaidLink 
                    linkToken={linkToken} 
                    onSuccess={handlePlaidSuccess}
                  />
                )
              }
            </div>
          </div>
        </div>

        <SecurityBanner />
      </div>
    </div>
  );
}

export default ConnectBankPage;