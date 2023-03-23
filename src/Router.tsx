import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/screens/Home";
import Search from "./components/screens/Search";
import Tv from "./components/screens/TV";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "/tv", element: <Tv /> },
      { path: "/search", element: <Search /> },
    ],
  },
]);

export default router;
