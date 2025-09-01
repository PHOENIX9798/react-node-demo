import {
  createBrowserRouter,
  Link,
} from "react-router-dom";
import Login from '@/pages/Login';
import BigFileUpload from '@/pages/BigFileUpload';
import { TestSendRequest } from "@/pages/TestSendRequest";
import { Divider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Welcome to xiuxiu demo</h1>
        <Link to="/login">Test login</Link>
        <Divider type="vertical" />
        <Link to="/file">Test BigFileUpload</Link>
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
  {
    path: "file",
    element: <BigFileUpload />
  }
]);

export default router;