import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ConnectBankPage from "./pages/connect-bank/page";
import { loader } from "./pages/transactions/loader";
import TransactionsPage from "./pages/transactions/page";

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: "/",
    element: <ConnectBankPage />
  },
  {
    path: "/transactions",
    element: <TransactionsPage />,
    loader: loader(queryClient)
  }
])

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
