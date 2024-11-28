import { DollarSign } from 'lucide-react';
import { useQueryListAccounts } from '../../hooks/apis/useQueryListAccounts';
import { AccountCard } from './components/AccountCard';

function AccountsPage() {
  const { data: accounts = [] } = useQueryListAccounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Accounts</h1>
            <p className="text-gray-600 mt-1">Manage your financial accounts in one place</p>
          </div>
          <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Total Balance: {
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(
                accounts.reduce((sum, account) => sum + (account.balances.current ?? 0), 0)
              )
            }</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {accounts.map((account) => (
            <AccountCard key={account.account_id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountsPage;