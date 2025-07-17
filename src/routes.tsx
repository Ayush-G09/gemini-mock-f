import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home/Index";
import Layout from "./views/Layout/Index";
import Dashboard from "./views/Dashboard/Index";
import Search from "./views/Search/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ":id",
        element: <Dashboard />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);
