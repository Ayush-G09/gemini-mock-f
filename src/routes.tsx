import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home/Index";
import Layout from "./views/Layout/Index";
import Dashboard from "./views/Dashboard/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
