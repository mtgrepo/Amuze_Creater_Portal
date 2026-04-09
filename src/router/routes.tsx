import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
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
import MuzeBox from "@/features/Entertainment/MuzeBox/Title/muzeBox_main";
import MuzeBoxTitleCreate from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_create";
import UpdateMuzeBoxTitle from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_update";
import MuzeBoxTitleDetails from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_details";
import  MuzeBoxEpisodeCreate from "../features/Entertainment/MuzeBox/Episode/muzeBox_episode_create";

const router = createBrowserRouter(
  [
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
          },
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
              { label: "Entertainment" },
              { label: "Novel", href: "/entertainment/novel" },
              { label: "Create" },
            ],
          },
        },
        {
          path: "/entertainment/novel/edit/:id",
          element: <UpdateNovel />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName;
              return [
                { label: "Entertainment" },
                { label: "Novel", href: "/entertainment/novel" },
              { label: `Edit ${titleName}` },
              ]
            },
          },
        },
        {
          path: "/entertainment/novel/details/:id",
          element: <NovelDetails />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName;
              return [
                { label: "Entertainment" },
                { label: "Novel", href: "/entertainment/novel" },
              { label: `${titleName}` },
              ]
            }
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
              { label: "Entertainment" },
              { label: "Comics", href: "/entertainment/comics" },
              { label: "Title Create" },
            ],
          },
        },
        {
          path: "/entertainment/comics/edit/:id",
          element: <EditTitlePage />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName;
              return [
                { label: "Entertainment" },

                { label: "Comics", href: "/entertainment/comics" },
                { label: `Edit ${titleName}` },
              ]
            },
          },
        },
        {
          path: "/entertainment/comics/details/:id",
          element: <ComicsTitleDetails />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName;
              return [
                { label: "Entertainment" },
                { label: "Comics", href: "/entertainment/comics" },
                { label: titleName },

              ]
            }
          },
        },
        {
          path: "/entertainment/comics/episode/create/:id",
          element: <ComicsEpisodeCreate />,
          handle: {
            crumb: ({ params, location }: any) => {
              const titleName = location?.state?.titleName;
              return [
                { label: "Entertainment" },
                { label: "Comics", href: "/entertainment/comics" },
                {
                  label: titleName,
                  href: `/entertainment/comics/details/${params?.id}`,
                },
                { label: "Episode Create" },
              ]
            },
          },
        },
        {
          path: "/entertainment/comics/:titleId/episode/edit/:id",
          element: <EditEpisodePage />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "Comics", href: "/entertainment/comics" },
              {
                label: location?.state?.titleName,
                href: `/entertainment/comics/details/${location?.state?.titleId}`,
              },
              {
                label: `Edit ${location?.state?.episode?.name}`,
                href: `/entertainment/comics/episode/details/${location?.state?.episode?.id}`,
              },
            ],
          },
        },
        {
          path: "/entertainment/comics/:titleId/episode/details/:id",
          element: <ComicEpisodeDetails />,
          handle: {
            crumb: ({ params, location }: any) => {
              const titleName = location?.state?.titleName || location?.state?.name;
              const episodeName = location?.state?.episode?.name;
              return [
                { label: "Entertainment" },
                { label: "Comics", href: "/entertainment/comics" },
                {
                  label: titleName,
                  href: `/entertainment/comics/details/${params?.titleId}`,
                },
                { label: episodeName },
              ]
            },
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
              { label: "Entertainment" },
              { label: ["Gallery"], href: "/entertainment/gallery" },
              { label: "Create" },
            ],
          },
        },
        {
          path: "/entertainment/gallery/edit/:id",
          element: <GalleryUpdate />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "Gallery", href: "/entertainment/gallery" },
              { label: `Edit ${location?.state?.titleName}` },
            ],
          },
        },
        {
          path: "/entertainment/gallery/details/:id",
          element: <GalleryDetails />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "Gallery", href: "/entertainment/gallery" },
              { label: `${location?.state?.titleName}` },
            ],
          },
        },
        // MuzeBox
        {
          path: "/entertainment/muze-box",
          element: <MuzeBox />,
          handle: { crumb: ["Entertainment", "MuzeBox"] },
        },
        {
          path: "/entertainment/muze-Box/title/create",
          element: <MuzeBoxTitleCreate />,
          handle: {
            crumb: [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: "Create" },
            ],
          },
        },
        {
          path: "/entertainment/muze-box/title/edit/:id",
          element: <UpdateMuzeBoxTitle />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: `Edit ${location?.state?.titleName}` },
            ],
          },
        },
        {
          path: "/entertainment/muze-box/title/details/:id",
          element: <MuzeBoxTitleDetails />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: `${location?.state?.titleName}` },
            ],
          }
        },
        {
          path: "/entertainment/muze-box/episode/create/:id",
          element: <MuzeBoxEpisodeCreate />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: `${location?.state?.titleName}` },
              { label: "Episode Create" },
            ]
          }
        },
        // story telling
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
            crumb: ({location} : any) => {
              return [
                { label: "StoryTelling", href: "/entertainment/storytelling" },
              { label: `Edit ${location?.state?.titleName}` },
              ]
            },
          },
        },
        {
          path: "/entertainment/storytelling/details/:id",
          element: <StoryTellingTitleDetails />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "StoryTelling", href: "/entertainment/storytelling" },
              { label: `${location?.state?.titleName}` },
            ],
          },
        },
        {
          path: "/entertainment/storytelling/:id/episode/create",
          element: <StoryTellingEpisodeCreate />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "StorytTelling", href: "/entertainment/storytelling" },
              {
                label: location?.state?.titleName,
                href: `/entertainment/storytelling/details/${location?.state?.titleId}`,
              },
              { label: "Episode Create" },
            ],
          },
        },
        {
          path: "/entertainment/storytelling/:titleId/episode/details/:id",
          element: <StoryTellingEpisodeDetails />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "StorytTelling", href: "/entertainment/storytelling" },
              {
                label: location?.state?.titleName,
                href: `/entertainment/storytelling/details/${location?.state?.titleId}`,
              },
              {
                label: location?.state?.episode?.name,
                href: `/entertainment/storytelling/details/${location?.state?.episode?.id}`,
              },
            ],
          },
        },
        {
          path: "/entertainment/storytelling/:titleId/episode/edit/:id",
          element: <StoryTellingEpisodeUpdate />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "StorytTelling", href: "/entertainment/storytelling" },
              {
                label: location?.state?.titleName,
                href: `/entertainment/storytelling/details/${location?.state?.titleId}`,
              },
              {
                label: `Edit ${location?.state?.episode?.name}`,
              },
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
  ],
  { basename: "/creator-portal" },
);

export default router;
