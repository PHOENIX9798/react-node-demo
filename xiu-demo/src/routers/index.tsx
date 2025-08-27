import {
  createBrowserRouter,
  Link,
} from "react-router-dom";
import Login from '@/pages/Login'
import { TestSendRequest } from "@/pages/TestSendRequest";
import { Divider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Welcome to xiuxiu demo</h1>
        <Link to="/login">To login</Link>
        <Divider type="vertical" />
        <Link to="/home">About me</Link>
      </div>
    ),
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "home",
    element: <TestSendRequest />,
  },
]);

export default router;