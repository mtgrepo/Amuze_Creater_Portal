import CommentsSection from "@/components/Entertainment/Comics/Title/comics_comments";
import { useComicsTitleDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleDetailsQuery";
import { decryptAuthData } from "@/lib/helper";
import { useParams } from "react-router-dom";
import { DollarSign, Star, Eye, ThumbsUp, Loader2 } from "lucide-react";

export default function ComicsTitleDetails() {
  const { id } = useParams();

  // Extract and decrypt user data safely
  const authData = localStorage.getItem("creator");
  const loginCreator = authData ? decryptAuthData(authData) : null;
  const creator = loginCreator?.creator;
  
  const userId = Number(creator?.id) || 0;
  const roleId = Number(creator?.role_id) || 0;

  const payload = {
    id: id!,
    roleId: roleId,
    userId: userId,
  };

  // Fetch details using your custom hook
  const { titleDetails: comic, isLoading, error } = useComicsTitleDetailsQuery(payload);

  // --- 1. LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  // --- 2. ERROR OR EMPTY STATE ---
  if (error || !comic) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-gray-400">Failed to load comic details. Please refresh or try again.</p>
        </div>
      </div>
    );
  }

  // --- 3. SUCCESS STATE (Data is now guaranteed to exist) ---
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Banner / Header Area */}
      <div className="relative w-full h-80 md:h-96">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${comic?.horizontal_thumbnail})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Content Overlay */}
        <div className="relative flex p-6 max-w-6xl mx-auto h-full items-end gap-6">
          {/* Vertical Poster */}
          <img
            src={comic?.thumbnail}
            alt={comic?.name}
            className="w-32 md:w-48 h-60 rounded-lg shadow-2xl border border-gray-700 object-cover"
          />

          <div className="flex-1 pb-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {comic?.name}
            </h1>
            <p className="text-gray-400 mb-4">By {comic?.createdByUser?.name || "Unknown Creator"}</p>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {comic?.generes?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="bg-gray-800/80 px-3 py-1 rounded-full text-xs border border-gray-600"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <span>{comic?.price ?? 0} Kyats</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <span>{comic?.rating ?? 0} Rating</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-500" />
                </div>
                <span>{comic?.views ?? 0} Views</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-red-500/20 p-1.5 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-red-500" />
                </div>
                <span>{comic?.likes ?? 0} Likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-100">
            Episode Lists
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-1.5 rounded-full text-sm font-medium transition-colors">
            Add
          </button>
        </div>

        <div className="space-y-3">
          {comic?.comic_episodes?.length > 0 ? (
            comic.comic_episodes.map((ep: any, index: number) => (
              <div
                key={ep.id}
                className="flex items-center bg-[#121212] border border-gray-800 p-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <span className="w-8 text-gray-500 text-center">
                  {index + 1}
                </span>
                <img
                  src={comic.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded object-cover mx-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {ep.title || `Episode ${index + 1}`}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(comic.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 px-4">
                  <span className="text-yellow-500 text-sm">🪙 0</span>
                  <div className="bg-gray-800 px-2 py-1 rounded text-xs">
                    1 ⌄
                  </div>
                  <div className="text-green-500 text-xl">✔️</div>
                  <button className="text-gray-500 hover:text-white">⋮</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
              <p className="text-gray-500 italic">
                No episodes available for "{comic?.name}" yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <CommentsSection />
    </div>
  );
}