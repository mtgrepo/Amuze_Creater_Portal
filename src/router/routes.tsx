import Dashboard from "@/features/Dashboard/dashboard";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/components/not-found";
import { ProtectedRoute, PublicRoute } from "./guard";
import LoginPage from "@/features/Auth/login";
import Novel from "@/features/Entertainment/Novel/novel";
import Comics from "@/features/Entertainment/Comics/comics";
import TitleCreate from "@/features/Entertainment/Comics/comics_title_create";
import EditTitlePage from "@/features/Entertainment/Comics/comics_title_update";
import ComicsTitleDetails from "@/features/Entertainment/Comics/comics_title_details";
import ComicsEpisodeCreate from "@/features/Entertainment/Comics/comics_episode_create";
import EditEpisodePage from "@/features/Entertainment/Comics/comics_episode_update";
import ComicEpisodeDetails from "@/features/Entertainment/Comics/comics_episode_details";
import StoryTellingLayout from "@/features/Entertainment/StoryTelling/storytellinglayout";
import EditStoryTellingTitlePage from "@/features/Entertainment/StoryTelling/storytelling_title_update";
import NovelCreate from "../features/Entertainment/Novel/novel_create";
import UpdateNovel from "../features/Entertainment/Novel/novel_update";
import NovelDetails from "../features/Entertainment/Novel/novel_details";
import AuthorReport from "../features/Report/author_report";
import StoryTellingTitleDetails from "@/features/Entertainment/StoryTelling/storytelling_title_details";
import StoryTellingEpisodeCreate from "@/features/Entertainment/StoryTelling/storytelling_episode_create";
import StoryTellingEpisodeUpdate from "@/features/Entertainment/StoryTelling/storytelling_episode_update";
import GalleryMain from "@/features/Entertainment/Gallery/gallery";
import GalleryCreate from "@/features/Entertainment/Gallery/gallery_create";
import GalleryUpdate from "@/features/Entertainment/Gallery/gallery_update";
import GalleryDetails from "@/features/Entertainment/Gallery/gallery_details";
import MuzeBox from "@/features/Entertainment/MuzeBox/Title/muzeBox_main";
import MuzeBoxTitleCreate from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_create";
import UpdateMuzeBoxTitle from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_update";
import MuzeBoxTitleDetails from "@/features/Entertainment/MuzeBox/Title/muzeBox_title_details";
import MuzeBoxEpisodeCreate from "../features/Entertainment/MuzeBox/Episode/muzeBox_episode_create";
import MuzeBoxEditEpisodePage from "@/features/Entertainment/MuzeBox/Episode/muzeBox_episode_update";
import MuzeBoxEpisodeDetails from "../features/Entertainment/MuzeBox/Episode/muzeBox_episode_details";
import ProfileDetails from "@/features/Auth/profile_details";
import Grades from "../features/Entertainment/Education/Grades/grades";
import GradesCreate from "../features/Entertainment/Education/Grades/grades_create";
import GradeUpdate from "../features/Entertainment/Education/Grades/grades_update";
import GradeDetails from "../features/Entertainment/Education/Grades/grade_details";
import CourseCreate from "../features/Entertainment/Education/Course/course_create";
import CourseDetails from "../features/Entertainment/Education/Course/course_details";
import CourseUpdate from "../features/Entertainment/Education/Course/course_update";
import MuseumLayout from "@/features/Entertainment/Museum/museum_layout";
import MuseumCreate from "@/features/Entertainment/Museum/museum_create";
import MuseumDetails from "@/features/Entertainment/Museum/museum_details";
import MuseumUpdate from "@/features/Entertainment/Museum/museum_update";
import MuseumTitleCreate from "@/features/Entertainment/Museum/museum_title_create";
import StoryTellingTitleCreate from "@/features/Entertainment/StoryTelling/storytelling_title_create";
import MuseumTitleDetails from "@/features/Entertainment/Museum/museum_title_details";
import NotificationPage from "@/features/Notification/notification";
import TitleUpdatePage from "@/features/Entertainment/Museum/museum_title_update";
import MuseumEpisodeCreate from "@/features/Entertainment/Museum/museum_episode_create";
import MuseumEpisodeUpdatePage from "@/features/Entertainment/Museum/museum_episode_update";
import MuseumEpisodeDetails from "@/features/Entertainment/Museum/museum_episode_details";
import PostLayout from "@/features/Entertainment/Posts/post_layout";
import PostsDetailPage from "@/features/Entertainment/Posts/post_details";
import PostCreate from "@/features/Entertainment/Posts/post_create";
import PostUpdate from "@/features/Entertainment/Posts/post_update";
import PurchaseReport from "../features/Report/purchase_report";
import RequestOTPForm from "@/components/request-otp-form";
import VerifyOtpPage from "@/components/verify-otp-page";
import ResetPasswordPage from "@/components/reset-password-page";

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
        {
          path: "/report/purchase",
          element: <PurchaseReport />,
          handle: {
            crumb: ["Report", "Purchase Report"],
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
              { label: "Gallery", href: "/entertainment/gallery" },
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
          path: "/entertainment/muze-box/title/create",
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
              { label: `${location?.state?.titleName}`, href: `/entertainment/muze-box/title/details/${location?.state?.titleId}` },
              { label: "Episode Create" },
            ]
          }
        },
        {
          path: "/entertainment/muze-box/:titleId/episode/edit/:id",
          element: <MuzeBoxEditEpisodePage />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: `${location?.state?.titleName}`, href: `/entertainment/muze-box/title/details/${location?.state?.titleId}` },
              { label: `Edit ${location?.state?.episode?.name}` },
            ]
          }
        },
        {
          path: "/entertainment/muze-box/:titleId/episode/details/:id",
          element: <MuzeBoxEpisodeDetails />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "Entertainment" },
              { label: "MuzeBox", href: "/entertainment/muze-box" },
              { label: `${location?.state?.titleName}`, href: `/entertainment/muze-box/title/details/${location?.state?.titleId}` },
              { label: `${location?.state?.episode?.name}` },
            ]
          }
        },
        // education
        {
          path: "/entertainment/education",
          element: <Grades />,
          handle: { crumb: ["Entertainment", "Education", "Grades"] },
        },
        {
          path: "/entertainment/education/grades/create",
          element: <GradesCreate />,
          handle: {
            crumb: [
              { label: "Entertainment" },
              { label: "Education", href: "/entertainment/education" },
              { label: "Grades", href: "/entertainment/education/grades" },
              { label: "Create" },
            ],
          }
        },
        {
          path: "/entertainment/education/grades/edit/:id",
          element: <GradeUpdate />,
          handle: {
            crumb: ({ location }: any) => {
              return [
                { label: "Entertainment" },
                { label: "Education", href: "/entertainment/education" },
                { label: location?.state?.grade, href: "/entertainment/education" },
                { label: `Edit` },
              ]
            },
          }
        },
        {
          path: "/entertainment/education/grades/details/:id",
          element: <GradeDetails />,
          handle: {
            crumb: ({ location }: any) => {
              return [
                { label: "Entertainment" },
                { label: "Education", href: "/entertainment/education" },
                { label: location?.state?.grade },
              ]
            }
          }
        },
        {
          path: "/entertainment/education/courses/create/:id",
          element: <CourseCreate />,
          handle: {
            crumb: ({ location }: any) => {
              return [
                { label: "Entertainment" },
                { label: "Education", href: "/entertainment/education" },
                { label: location?.state?.titleName, href: `/entertainment/education/grades/details/${location?.state?.titleId}` },
                { label: "Course" },
              ]
            }
          }
        },
        {
          path: "/entertainment/education/:titleId/courses/details/:id",
          element: <CourseDetails />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName
              return [
                { label: "Entertainment" },
                { label: "Education", href: "/entertainment/education" },
                { label: titleName, href: `/entertainment/education/grades/details/${location?.state?.titleId}` },
                { label: location?.state?.course?.name },
              ]
            }
          }
        },
        {
          path: "/entertainment/education/:titleId/course/edit/:id",
          element: <CourseUpdate />,
          handle: {
            crumb: ({ location }: any) => {
              const titleName = location?.state?.titleName
              return [
                { label: "Entertainment" },
                { label: "Education", href: "/entertainment/education" },
                { label: titleName, href: `/entertainment/education/grades/details/${location?.state?.titleId}` },
                { label: `Edit ${location?.state?.course?.name}` },
              ]
            }
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
            crumb: ({ location }: any) => {
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
              { label: "StoryTelling", href: "/entertainment/storytelling" },
              {
                label: location?.state?.titleName,
                href: `/entertainment/storytelling/details/${location?.state?.titleId}`,
              },
              { label: "Episode Create" },
            ],
          },
        },
        {
          path: "/entertainment/storytelling/:titleId/episode/edit/:id",
          element: <StoryTellingEpisodeUpdate />,
          handle: {
            crumb: ({ location }: any) => [
              { label: "StoryTelling", href: "/entertainment/storytelling" },
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
        //Museum
        {
          path: "/entertainment/museum",
          element: <MuseumLayout />,
          handle: { crumb: ["Entertainment", "Museum"] },
        },
        {
          path: "/entertainment/museum/create",
          element: <MuseumCreate />,
          handle: {
            crumb: [
              { label: ["Museum"], href: "/entertainment/museum" },
              { label: "Museum Create" },
            ],
          },
        },
        {
          path: "/entertainment/museum/edit/:id",
          element: <MuseumUpdate />,
          handle: {
            crumb: [
              { label: ["Museum"], href: "/entertainment/museum" },
              { label: "Museum Edit" },
            ],
          },
        },
        {
          path: "/entertainment/museum/details/:id",
          element: <MuseumDetails />,
          handle: {
            crumb: ({ params, data }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              { label: data?.data?.name ?? `Museum ${params.id}` },
            ],
          },
        },
        //museum title
        {
          path: "/entertainment/museum/:id/title/create",
          element: <MuseumTitleCreate />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.id}`,
                href: `/entertainment/museum/${params?.id}/title/create`,
              },
              { label: "Title Create" },
            ],
          },
        },
        {
          path: "/entertainment/museum/:museumId/title/edit/:id",
          element: < TitleUpdatePage />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.museumId}`,
                href: `/entertainment/museum/details/${params?.museumId}`,
              },
              {
                label: `Title ${params?.id} Edit`,
                href: `/entertainment/museum/${params?.museumId}/title/details/${params?.id}`
              },
            ],
          },
        },
        {
          path: "/entertainment/museum/:museumId/title/details/:titleId",
          element: <MuseumTitleDetails />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.museumId}`,
                href: `/entertainment/museum/details/${params?.museumId}`,
              },
              {
                label: `Title ${params?.titleId}`,
                href: `/entertainment/museum/title/details/${params?.titleId}`,
              },
              { label: "Details" },
            ],
          },
        },
        //notification
        {
          path: "/entertainment/museum/:museumId/title/:titleId/episode/create",
          element: <MuseumEpisodeCreate />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.museumId}`,
                href: `/entertainment/museum/details/${params?.museumId}`,
              },
              {
                label: `Title ${params?.id}`,
                href: `/entertainment/museum/${params?.museumId}/title/details/${params.titleId}`,
              },
              {
                label: "Episode Create"
              }
            ],
          },
        },
        {
          path: "/entertainment/museum/:museumId/title/:titleId/episode/edit/:episodeId",
          element: <MuseumEpisodeUpdatePage />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.museumId}`,
                href: `/entertainment/museum/details/${params?.museumId}`,
              },
              {
                label: `Title ${params?.titleId}`,
                href: `/entertainment/museum/${params?.museumId}/title/details/${params.titleId}`,
              },
              {
                label: `Episode ${params?.episodeId} Edit`,
                href: `entertainment/museum/${params?.museumId}/title/${params?.titleId}/episode/${params?.episodeId}`
              },
              {
                label: "Episode Edit"
              }
            ],
          },
        },
        {
          path: "/entertainment/museum/:museumId/title/:titleId/episode/details/:id",
          element: <MuseumEpisodeDetails />,
          handle: {
            crumb: ({ params }: any) => [
              { label: ["Museum"], href: "/entertainment/museum" },
              {
                label: `Museum ${params?.museumId}`,
                href: `/entertainment/museum/details/${params?.museumId}`,
              },
              {
                label: `Title ${params?.titleId}`,
                href: `/entertainment/museum/title/details/${params?.titleId}`,
              },
              {
                label: `Episode ${params?.id}`,
                href: `/entertainment/museum/${params?.museumId}/title/${params?.titleId}/episode/details/${params?.id}`
              },
              { label: "Details" },
            ]
          }
        },

        //post
        {
          path: "/entertainment/posts",
          element: <PostLayout />,
          handle: { crumb: ["Entertainment", "Posts"] },
        },
        {
          path: "/entertainment/posts/create",
          element: <PostCreate />,
          handle: {
            crumb: [
              { label: ["Posts"], href: "/entertainment/posts" },
              { label: "Post Create" },
            ],
          },
        },
        {
path: "/entertainment/posts/edit/:id",
          element: <PostUpdate />,
          handle: {
            crumb: [
              { label: ["Posts"], href: "/entertainment/posts" },
              { label: "Post Edit" },
            ],
          },
        },
        {
          path: "/entertainment/posts/details/:id",
          element: <PostsDetailPage />,
          handle: {
            crumb: ({ params, data }: any) => [
              { label: ["Posts"], href: "/entertainment/posts" },
              { label: data?.data?.name ?? `Post ${params.id}` },
            ],
          },
        },

        // Genres
        {
          path: "/notifications",
          element: <NotificationPage />,
          handle: {
            crumb: ["Notifications"],
          }
        },
        //Auth
        {
          path: "/account/user-details",
          element: <ProfileDetails />,
          handle: {
            crumb: [
              { label: 'Account' },
              { label: "Details" }
            ]
          }
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
     {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <RequestOTPForm />
        </PublicRoute>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <PublicRoute>
          <VerifyOtpPage />
        </PublicRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      ),
    },
  ],
  { basename: "/creator-portal/" },
);

export default router;
