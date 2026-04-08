import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter} from "react-router-dom";
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
import EditEpisodePage from "@/features/Entertainment/Comics/comics_episode_update";
import ComicEpisodeDetails from "@/features/Entertainment/Comics/comics_episode_details";
import StoryTellingLayout from "@/features/Entertainment/StoryTelling/storytellinglayout";
import StoryTellingTitleCreate from "@/features/Entertainment/StoryTelling/storytelling_title_create";
import EditStoryTellingTitlePage from "@/features/Entertainment/StoryTelling/storytelling_title_update";
import NovelCreate from "../features/Entertainment/Novel/novel_create";
import UpdateNovel from "../features/Entertainment/Novel/novel_update";
import NovelDetails from "../features/Entertainment/Novel/novel_details";
import AuthorReport from "../features/Report/author_report";
import StoryTellingTitleDetails from "@/features/Entertainment/StoryTelling/storytelling_title_details";
import StoryTellingEpisodeCreate from "@/features/Entertainment/StoryTelling/storytelling_episode_create";
import StoryTellingEpisodeDetails from "@/features/Entertainment/StoryTelling/storytelling_episode_details";
import StoryTellingEpisodeUpdate from "@/features/Entertainment/StoryTelling/storytelling_episode_update";
import GalleryMain from "@/features/Entertainment/Gallery/gallery";
import GalleryCreate from "@/features/Entertainment/Gallery/gallery_create";
import GalleryUpdate from "@/features/Entertainment/Gallery/gallery_update";
import GalleryDetails from "@/features/Entertainment/Gallery/gallery_details";

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
      // Report
      {
        path: "/report/author",
        element: <AuthorReport />,
        handle: {
          crumb: ["Report", "Author Income Report"],
        }
      },
      // Entertainment
      {
        path: "/entertainment/novel",
        element: <Novel />,
        handle: { crumb: ["Entertainment", "Novel"] },
      },
      {
        path: "/entertainment/novel/create",
        element: <NovelCreate />,
        handle: {
          crumb: [
            { label: ["Novel"], href: "/entertainment/novel" },
            { label: "Create" },
          ], },
      },
      {
        path: "/entertainment/novel/edit/:id",
        element: <UpdateNovel />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Novel"], href: "/entertainment/novel" },
            { label: `Edit Novel ${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/novel/details/:id",
        element: <NovelDetails />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Novel"], href: "/entertainment/novel" },
            { label: ` Details ${params?.id}` },
          ],
        },
      },
      // Comics
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
          crumb: ({ params }: any) => [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: `Edit Title ${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/comics/details/:id",
        element: <ComicsTitleDetails />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: `Title Details ${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/comics/episode/create/:id",
        element: <ComicsEpisodeCreate />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Entertainment"] },
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: `Title ${params?.id}`, href: `/entertainment/comics/details/${params?.id}` },
            { label: "Episode Create" },
          ],
        },
      },
      {
        path: "/entertainment/comics/:titleId/episode/edit/:id",
        element: <EditEpisodePage />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Entertainment"] },
            { label: ["Comics"], href: "/entertainment/comics" },
            { label: `Title ${params?.titleId}`, href: `/entertainment/comics/details/${params?.titleId}` },
            { label: `Episode ${params?.id} Edit`, href: `/entertainment/comics/episode/details/${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/comics/:titleId/episode/details/:id",
        element: <ComicEpisodeDetails />,
        handle: {
          crumb: ({ params }: any) => [
            { label: "Entertainment" },
            { label: "Comics", href: "/entertainment/comics" },
            {
              label: `Title ${params?.titleId}`,
              href: `/entertainment/comics/details/${params?.titleId}`,
            },
            { label: "Details" },
          ],
        },
      },
      // Gallery
      {
        path: "/entertainment/gallery",
        element: <GalleryMain />,
        handle: { crumb: ["Entertainment", "Gallery"] },
      },
      {
        path: "/entertainment/gallery/create",
        element: <GalleryCreate />,
        handle: {
          crumb: [
            { label: ["Gallery"], href: "/entertainment/gallery" },
            { label: "Create" },
          ],
        }
      },
      {
        path: "/entertainment/gallery/edit/:id",
        element: <GalleryUpdate />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Gallery"], href: "/entertainment/gallery" },
            { label: `Edit Gallery ${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/gallery/details/:id",
        element: <GalleryDetails />,
        handle: {
          crumb: ({ params }: any) => [
            { label: ["Gallery"], href: "/entertainment/gallery" },
            { label: `Details ${params?.id}` },
          ],
        },
      },
      {
        path: "/entertainment/storytelling",
        element: <StoryTellingLayout />,
        handle: { crumb: ["Entertainment", "StoryTelling"] },
      },
       {
        path: "/entertainment/storytelling/title",
        element: <StoryTellingTitleCreate />,
        handle: {
          crumb: [
            { label: ["StoryTelling"], href: "/entertainment/storytelling" },
            { label: "Title Create" },
          ],
        },
      },
     {
        path: "/entertainment/storytelling/edit/:id",
        element: <EditStoryTellingTitlePage />,
        handle: {
          crumb: [
            { label: ["StoryTelling"], href: "/entertainment/storytelling" },
            { label: "Title Edit" },
          ],
        },
      },
      {
        path: "/entertainment/storytelling/details/:id",
        element: <StoryTellingTitleDetails/>,
        handle : {
          crumb: ({params, data}: any) => [
            {label: ["StoryTelling"], href: "/entertainment/storytelling"},
            {label: data?.data?.name ?? `Title ${params.id}`}
          ]
        }
      },
      {
        path: "/entertainment/storytelling/:id/episode/create",
        element: <StoryTellingEpisodeCreate/>,
        handle: {
          crumb:({params}:any) => [
            {label: ["StorytTelling"], href: "/entertainment/storytelling"},
            {label: `Title ${params?.id}`, href: `/entertainment/storytelling/${params?.id}/episode/create`},
            {label: "Episode Create"}
          ]
        }
      },
      {
        path: "/entertainment/storytelling/:titleId/episode/details/:id",
        element: <StoryTellingEpisodeDetails/>,
        handle: {
          crumb:({params}:any) => [
            {label: ["StorytTelling"], href: "/entertainment/storytelling"},
            {label: `Title ${params?.titleId}`, href: `/entertainment/storytelling/details/${params?.titleId}`},
            {label: `Episode ${params?.id}`, href: `/entertainment/storytelling/details/${params?.id}`},
            {label: "Details"}
          ]
        }
      },
       {
        path: "/entertainment/storytelling/:titleId/episode/edit/:id",
        element: <StoryTellingEpisodeUpdate/>,
        handle: {
          crumb:({params}:any) => [
            {label: ["StorytTelling"], href: "/entertainment/storytelling"},
            {label: `Title ${params?.titleId}`, href: `/entertainment/storytelling/details/${params?.titleId}`},
            {label: `Episode ${params?.id}`, href: `/entertainment/storytelling/episode/details/${params?.id}`},
            {label: "Details"}
          ]
        }
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
], { basename: "/creator-portal" });

export default router;
