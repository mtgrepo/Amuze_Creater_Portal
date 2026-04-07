import { AudioView } from "@/components/common/audio_view";
import { Status } from "@/components/common/status";
import { Button } from "@/components/ui/button";
import { useEpisodeDetailQuery } from "@/composable/Query/Entertainment/StoryTelling/useEpisodeDetailsQuery";
import { ArrowLeft, CircleDollarSign, FileMusic, Loader2} from "lucide-react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function StoryTellingEpisodeDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [showAudio, setShowAudio] = React.useState(false);

    const titleId = location.state?.titleId;

    const { storyTellingEpisodeDetails, isLoading } = useEpisodeDetailQuery(
        titleId, Number(id)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-gray-400">Loading storytelling details...</p>
            </div>
        );
    }

    if (!storyTellingEpisodeDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <p>Episode details not found.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* HERO CARD */}
                <div className="relative overflow-hidden rounded-2xl border border-border min-h-75">
                    <div
                        className="absolute inset-0 opacity-30 grayscale-[0.5] blur-sm bg-cover bg-center"
                        style={{ backgroundColor: "var(--card-foreground)" }}
                    />

                    <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center md:items-start">
                        <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
                            <img
                                src={storyTellingEpisodeDetails.thumbnail}
                                alt={storyTellingEpisodeDetails.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
                                    {storyTellingEpisodeDetails.name || `Ep ${id}`}
                                </h1>
                                <Status icon={<CircleDollarSign size={16} />} value={storyTellingEpisodeDetails.price} color={"yellow"} label={"MMK"} />
                            </div>
                        </div>
                    </div>
                </div>


                <Button
                    className="w-full bg-primary/90 text-white cursor-pointer"
                    onClick={() => setShowAudio((prev) => !prev)}
                >
                   <FileMusic/> Audio File
                </Button>

                {showAudio && (
                    <AudioView fileUrl={storyTellingEpisodeDetails.file_path} open={showAudio}
                        onClose={() => setShowAudio(false)} />
                )}

                {/* BACK BUTTON */}
                <div className="pt-4">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2" size={18} />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    )
}