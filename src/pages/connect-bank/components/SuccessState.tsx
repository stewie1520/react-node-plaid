import { BadgeDollarSignIcon, CheckCircle, Trash2, Wallet } from 'lucide-react';
import { useCommandDeleteLink } from '../../../hooks/apis/useCommandDeleteLink';
import { useNavigate } from 'react-router-dom';

export function SuccessState() {
  const { mutateAsync: deleteLink } = useCommandDeleteLink();
  const navigate = useNavigate();

  const onDelete = async () => {
    await deleteLink();
  }

  return (
    <div className="text-center space-y-4 flex flex-col justify-center">
      <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto
                    flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>

      <p className="text-lg font-semibold text-gray-900">
        Successfully Connected!
      </p>

      <div className='flex flex-row items-center gap-4'>
        <a onClick={() => navigate('/transactions')} className='flex flex-row items-center gap-2 cursor-pointer text-blue-500'>
          <div className='bg-blue-500/10 p-1 rounded-lg'>
            <BadgeDollarSignIcon className="w-4 h-4 text-blue-500" />
          </div>
          View transaction
        </a>

        <a onClick={() => navigate('/accounts')} className='flex flex-row items-center gap-2 cursor-pointer text-green-500'>
          <div className='bg-green-500/10 p-1 rounded-lg'>
            <Wallet className="w-4 h-4 text-green-500" />
          </div>
          My Accounts
        </a>
      </div>

      <div className='w-full flex items-center justify-center'>
        <a onClick={onDelete} className='flex flex-row items-center gap-2 text-red-500 cursor-pointer'>
          <div className='bg-red-500/10 p-1 rounded-lg'>
            <Trash2 className="w-4 h-4" />
          </div>
          Disconnect
        </a>
      </div>
    </div>
  );
}