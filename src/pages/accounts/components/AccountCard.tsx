import { Building2, CreditCard, Wallet } from "lucide-react";
import { AccountBase } from "plaid";

export function AccountCard({ account }: { account: AccountBase }) {
  const getIcon = (type: string, subtype: string | null) => {
    switch (subtype) {
      case 'checking':
        return <CreditCard className="w-6 h-6" />;
      case 'savings':
        return <Wallet className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  const formatCurrency = (amount: number | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.balances.iso_currency_code || 'USD',
    }).format(amount ?? 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            {getIcon(account.type, account.subtype)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{account.name}</h3>
            <p className="text-sm text-gray-500">****{account.mask}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(account.balances.current)}
          </p>
          <p className="text-sm text-gray-500">Current Balance</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="font-medium text-gray-800">
              {formatCurrency(account.balances.available)}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm capitalize">
            {account.subtype}
          </div>
        </div>
      </div>
    </div>
  );
}
