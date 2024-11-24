import emptyImageUrl from './empty.png';

export const EmptyTransactionList = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md flex flex-col items-center justify-center flex-1 py-10">
      <img src={emptyImageUrl} alt="Empty Transactions" className="h-64 w-64" />
      <h2 className="text-lg font-normal text-gray-500 mt-6">No transactions found</h2>
    </div>
  )
}
