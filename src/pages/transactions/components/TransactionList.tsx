import { format } from 'date-fns';
import { MapPinIcon, ShoppingBagIcon } from 'lucide-react';
import { useQueryTransactions } from '../../../hooks/apis';
import { EmptyTransactionList } from './EmptyTransactionList';
import InfiniteScroll from 'react-infinite-scroll-component';


export function TransactionList() {
  const { data: transactionPages, fetchNextPage, hasNextPage } = useQueryTransactions({ page: 1, perPage: 10 });
  const transactions = transactionPages?.pages.flatMap((page) => page.items) ?? [];

  return (
    !transactions.length ? (
      <EmptyTransactionList />
    ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <InfiniteScroll
          dataLength={transactions.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          scrollableTarget="#transaction-list"
          loader={<div className="py-4 text-center">Loading...</div>}
        >
          <ul role="list" className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <li key={transaction.account_id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {transaction.logo_url ? (
                        <img
                          src={transaction.logo_url}
                          alt={transaction.merchant_name ?? 'Merchant Logo'}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <ShoppingBagIcon className="h-10 w-10 text-gray-400" />
                      )}
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {transaction.merchant_name}
                          </h3>
                          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.amount < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {format(new Date(transaction.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {transaction.personal_finance_category?.detailed.split('_').join(' ').toLowerCase()}
                      </span>
                      {transaction.location && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {transaction.location.city || transaction.location.region ? (
                            <span className="truncate">
                              {transaction.location.city}, {transaction.location.region}
                            </span>
                          ) : (
                            <span className="text-gray-400">No location information</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      {transaction.category?.map((cat, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    )
  );
}