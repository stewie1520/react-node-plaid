import { useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { TransactionList } from "./components/TransactionList";
import { ArrowLeft } from "lucide-react";

function TransactionPage() {
  const isLinked = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLinked) {
      navigate('/');
    }
  }, [isLinked, navigate]);

  return (
    <div className="min-h-screen bg-gray-100" id="transaction-list">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6 gap-2">
          <Link to="/" className="rounded-full bg-neutral-200 p-1 cursor-pointer hover:bg-blue-100 transition-all text-neutral-600"><ArrowLeft className="size-3"/></Link>
          <h1 className="text-2xl font-semibold text-gray-900">Recent Transactions</h1>
        </div>

        <TransactionList/>
      </div>
    </div>
  );
}


export default TransactionPage;