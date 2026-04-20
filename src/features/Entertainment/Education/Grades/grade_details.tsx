import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  XCircle,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGradeDetailsQuery } from "../../../../composable/Query/Entertainment/Education/Grades/useGradeDetailsQuery";
import IconWithTooltip from "../../../../components/common/IconWithTooltip";
import CourseActions from "../../../../components/Entertainment/Education/Course/course_actions";

export default function GradeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Viewer State

  const { gradeDetails, isLoading } = useGradeDetailsQuery(
    Number(id),
  );

  console.log("grade details", gradeDetails)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading grade details...</p>
      </div>
    );
  }

  if (!gradeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p>Grade details not found.</p>
      </div>
    );
  }

const grade = gradeDetails?.grade;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-border min-h-75  bg-zinc-400 dark:bg-zinc-900">
          <div
            className="absolute inset-0 opacity-30  dark:grayscale-[0.5] blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${grade.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center ">
            <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
              <img
                src={grade.thumbnail}
                alt={grade.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight mb-2 uppercase text-white my-6">
                  {grade.name || `Comic ${id}`}
                </h1>

              </div>
            </div>
          </div>
        </div>

            <div className="bg-card border border-border p-5 md:p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Course Lists</h2>
            <Button
              onClick={() => navigate(`/entertainment/education/courses/create/${id}`, {
                state: {
                  titleName: grade?.name,
                  titleId: id
                }
              })}
              className="rounded-full shadow-lg"
            >
              Add Course
            </Button>
          </div>

          <div className="grid gap-3">
            {grade?.courses?.length > 0 ? (
              grade?.courses.map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center bg-background/40 border border-border p-4 rounded-2xl hover:bg-accent/50 transition-all gap-4"
                >
                  <div className="flex items-center w-full sm:w-auto">
                    <span className="w-6 text-muted-foreground font-mono font-medium">{(index + 1).toString().padStart(2, '0')}</span>
                    <img src={ep.thumbnail} alt="" className="w-20 h-14  object-cover mx-4 shadow-md" />
                    <div className="flex-1 sm:hidden">
                      <h4 className="font-bold text-sm">{ep.name || `Episode ${index + 1}`}</h4>
                      <p className="text-[10px] text-muted-foreground">🪙 {ep?.price} Kyats</p>
                    </div>
                  </div>

                  <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="font-bold truncate group-hover:text-primary transition-colors">{ep.name || `Episode ${index + 1}`}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(ep.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="hidden sm:inline-block text-sm font-bold text-yellow-600">🪙 {ep?.price}</span>
                    <div className="flex items-center gap-4">
                      {ep?.approve_status === 0 ? (
                        <IconWithTooltip tooltip="Pending" icon={<XCircle className="w-5 h-5 text-destructive" />} />
                      ) : (
                        <IconWithTooltip tooltip="Approved" icon={<CircleCheckBig className="w-5 h-5 text-emerald-500" />} />
                      )}
                      <CourseActions course={ep} titleId={grade?.id} titleName={grade?.name} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl opacity-50">
                <p className="italic">No episodes available yet.</p>
              </div>
            )}
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
