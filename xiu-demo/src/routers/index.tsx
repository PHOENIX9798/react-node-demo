import {
  createBrowserRouter,
  Link,
} from "react-router-dom";
import Login from '@/pages/Login'
import { Divider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Welcome to xiuxiu demo</h1>
        <Link to="/login">login</Link>
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
    element: <>xiuxiu</>,
  },
]);

export default router;