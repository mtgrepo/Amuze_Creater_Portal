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
import { useTranslation } from "react-i18next";

export default function GradeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Viewer State

  const { gradeDetails, isLoading } = useGradeDetailsQuery(Number(id));
  const { t } = useTranslation();

  // console.log("grade details", gradeDetails)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading details...
        </p>
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/entertainment/education")}
        >
          <ArrowLeft size={18} />
          Back to Grades
        </Button>
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

            <div className="flex-1 space-y-4 text-center md:text-left min-w-0 w-full">
              <div className="space-y-1">
                {/* Title with improved weight and color */}
                <h1 className="text-2xl lg:text-3xl max-w-xl mx-auto lg:mx-0 font-extrabold tracking-tight uppercase text-white">
                  {grade.name || `Grade ${id}`}
                </h1>

                {/* Date with a lighter opacity for hierarchy */}
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {new Date(grade.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center md:justify-start">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    grade?.approve_status === 0
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  }`}
                >
                  {grade?.approve_status === 0 ? "● Pending" : "● Approved"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-5 md:p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Course Lists</h2>
            <Button
              onClick={() =>
                navigate(`/entertainment/education/courses/create/${id}`, {
                  state: {
                    titleName: grade?.name,
                    titleId: id,
                  },
                })
              }
              className="rounded-full shadow-lg"
            >
              {t("add_new_course")}
            </Button>
          </div>

          <div className="grid gap-3">
            {grade?.courses?.length > 0 ? (
              grade?.courses.map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-background/40 border border-border p-4 rounded-2xl hover:bg-accent/50 transition-all gap-4"
                >
                  {/* Left side: Index, Thumbnail, and Episode Info Bundle */}
                  <div className="flex items-center gap-4 w-full md:w-auto min-w-0 flex-1">
                    <span className="w-6 text-muted-foreground font-mono font-medium shrink-0">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>

                    <img
                      src={ep.thumbnail}
                      alt=""
                      className="w-20 h-14 object-cover rounded-lg shadow-md shrink-0"
                    />

                    {/* Text Container: Fully visible everywhere with clean truncation */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                        {ep.name || `Episode ${index + 1}`}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(ep.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Price, Approval Status, Dropdown & Actions */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                    <span className="flex flex-row gap-1 items-center justify-center text-sm font-bold text-yellow-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-500"
                      >
                        <path
                          d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V6.5M2 5V17C2 18.1046 4.46243 19 7.5 19M7.5 11C7.33145 11 7.16468 10.9972 7 10.9918C4.19675 10.9 2 10.0433 2 9M7.5 15C4.46243 15 2 14.1046 2 13M22 11.5C22 12.6046 19.5376 13.5 16.5 13.5C13.4624 13.5 11 12.6046 11 11.5M22 11.5C22 10.3954 19.5376 9.5 16.5 9.5C13.4624 9.5 11 10.3954 11 11.5M22 11.5V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11.5M22 15.25C22 16.3546 19.5376 17.25 16.5 17.25C13.4624 17.25 11 16.3546 11 15.25"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {ep?.price}
                    </span>

                    <div className="flex items-center gap-4">
                      {ep?.approve_status === 0 ? (
                        <IconWithTooltip
                          tooltip="Pending"
                          icon={
                            <XCircle className="w-5 h-5 text-destructive" />
                          }
                        />
                      ) : (
                        <IconWithTooltip
                          tooltip="Approved"
                          icon={
                            <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                          }
                        />
                      )}

                      <CourseActions
                        course={ep}
                        titleId={grade?.id}
                        titleName={grade?.name}
                      />
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
      </div>
    </div>
  );
}
