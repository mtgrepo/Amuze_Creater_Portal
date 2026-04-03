import { useNavigate, useParams } from "react-router-dom";
import {
    Users,
    Banknote,
    Eye,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNovelDetailsQuery } from "../../../composable/Query/Entertainment/Novel/useNovelDetailsQuery";

export default function NovelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();


    const { novelDetails, isNovelDetailsLoading } = useNovelDetailsQuery(Number(id));
    if (isNovelDetailsLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-gray-400">Loading novel details...</p>
            </div>
        );
    }

    if (!novelDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <p>Novel details not found.</p>
            </div>
        );
    }

    // const images = novelDetails.files_path || [];

    // const handleNext = () => {
    //     if (currentImageIndex < images.length - 1) {
    //         setCurrentImageIndex((prev) => prev + 1);
    //     }
    // };

    // const handlePrev = () => {
    //     if (currentImageIndex > 0) {
    //         setCurrentImageIndex((prev) => prev - 1);
    //     }
    // };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* HERO CARD */}
                <div className="relative overflow-hidden rounded-2xl border border-border min-h-75">
                    <div
                        className="absolute inset-0 opacity-30 grayscale-[0.5] blur-sm bg-cover bg-center"
                        style={{ backgroundImage: `url(${novelDetails.thumbnail})` }}
                    />

                    <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center md:items-start">
                        <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
                            <img
                                src={novelDetails.thumbnail}
                                alt={novelDetails.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
                                    {novelDetails.name || `Novel ${id}`}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-border">
                                        <div className="bg-green-500/20 p-1 rounded-full text-green-500">
                                            <Banknote size={16} />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {novelDetails.price || 0} Kyats
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-border">
                                        <div className="bg-blue-500/20 p-1 rounded-full text-primary">
                                            <Eye size={16} />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {novelDetails.views || 0} Views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PDF VIEWER DIALOG */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-primary/90 text-white cursor-pointer">
                            Show PDF
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="w-full h-[90vh] p-0 border-border flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                            <h2 className="text-sm font-medium">PDF Viewer</h2>
                            <div className="w-6" />
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 w-full h-full">
                            {novelDetails?.file_path || novelDetails?.files_path?.[0]?.url ? (
                                <iframe
                                    src={
                                        novelDetails.file_path ||
                                        novelDetails.files_path?.[0]?.url
                                    }
                                    className="w-full h-full"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-500">
                                    No PDF available
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-primary p-6 rounded-2xl">
                        <div className="bg-white/20 p-4 rounded-full">
                            <Users size={32} className="text-white" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Sales</p>
                            <h3 className="text-3xl font-bold text-white">
                                {novelDetails.total_sales || 30}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-secondary p-6 rounded-2xl">
                        <div className="bg-white/20 dark:bg-zinc-800 p-4 rounded-full">
                            <Banknote size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Sales Amount</p>
                            <h3 className="text-3xl font-bold">
                                ${(novelDetails.total_sales_amount || 3000).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* BACK BUTTON */}
                <div className="pt-4">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2" size={18} />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
