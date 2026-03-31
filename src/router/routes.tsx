import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/components/not-found";
import { PublicRoute } from "./guard";
import LoginPage from "@/features/Auth/login";
import  Novel from "@/features/Entertainment/Novel/novel";

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
            // Entertainment
            {
                path: "/entertainment/novel",
                element: <Novel />,
                handle: { crumb: ["Entertainment", "Novel"] },
            }
        ]
        
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        )
    }
]);

export default router;
