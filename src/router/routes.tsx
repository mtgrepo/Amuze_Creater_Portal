import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter, href } from "react-router-dom";
import NotFound from "@/components/not-found";
import { ProtectedRoute, PublicRoute } from "./guard";
import LoginPage from "@/features/Auth/login";
import Novel from "@/features/Entertainment/Novel/novel";
import MainCategory from "@/features/Genre/MainCategory/main_category";
import Comics from "@/features/Entertainment/Comics/comics";
import TitleCreate from "@/features/Entertainment/Comics/comics_title_create";
import EditTitlePage from "@/features/Entertainment/Comics/comics_title_update";
import ComicsTitleDetails from "@/features/Entertainment/Comics/comics_title_details";
import ComicsEpisodeCreate from "@/features/Entertainment/Comics/comics_episode_create";
import { Label } from "radix-ui";
import EditEpisodePage from "@/features/Entertainment/Comics/comics_episode_update";
import ComicEpisodeDetails from "@/features/Entertainment/Comics/comics_episode_details";

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
        path: "/entertainment/comics/details/:id",
        element: <ComicsTitleDetails />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: "Title Details" },
          ],
        },
      },
      {
        path: "/entertainment/comics/episode/create/:id",
        element: <ComicsEpisodeCreate />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics" },
            { Label: "Episode Create" },
          ],
        },
      },
      {
        path: "/entertainment/comics/episode/edit/:id",
        element: <EditEpisodePage />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: "Episode Edit" },
          ],
        },
      },
            {
        path: "/entertainment/comics/episode/details/:id",
        element: <ComicEpisodeDetails />,
        handle: {
          crumb: [
            { label: ["Comics"], href: "/entertainment/comics/:id" },
            { label: "Episode Details" },
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
