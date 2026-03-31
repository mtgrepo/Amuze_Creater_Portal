import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/components/not-found";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
                <App />
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
                handle: { crumb: "Dashboard" },
            },
            {
                path: "*",
                element: <NotFound />,
                handle: { crumb: "Not Found" },
            },
        ]
        
    },
]);

export default router;
