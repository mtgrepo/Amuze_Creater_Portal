import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/components/not-found";
import { ProtectedRoute, PublicRoute } from "./guard";
import LoginPage from "@/features/Auth/login";
import Novel from "@/features/Entertainment/Novel/novel";
import MainCategory from "@/features/Genre/MainCategory/main_category";
import Comics from "@/features/Entertainment/Comics/comics";
import TitleCreate from "@/features/Entertainment/Comics/comic_title_create";
import EditTitlePage from "@/features/Entertainment/Comics/comic_title_update";
import StoryTellingLayout from "@/features/Entertainment/StoryTelling/storytellinglayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
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
      },
      {
        path: "/entertainment/comics",
        element: <Comics />,
        handle: { crumb: ["Entertainment", "Comics"] },
      },
      {
        path: "/entertainment/comics/title",
        element: <TitleCreate />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: "Title Create" },
          ],
        },
      },
      {
        path: "/entertainment/comics/edit/:id",
        element: <EditTitlePage />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: "Title Edit" },
          ],
        },
      },
      {
        path: "/entertainment/storytelling",
        element: <StoryTellingLayout />,
        handle: { crumb: ["Entertainment", "StoryTelling"] },
      },
     {
        path: "/entertainment/storytelling/edit/:id",
        element: <EditTitlePage />,
        handle: {
          crumb: [
            { label: ["StoryTelling"], href: "/entertainment/storytelling" },
            { label: "Title Edit" },
          ],
        },
      },
      // Genres
      {
        path: "/features/main-category",
        element: <MainCategory />,
        handle: { crumb: ["Genres", "Main Category"] },
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
]);

export default router;
