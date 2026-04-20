import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCourseDetailsQuery } from "../../../../composable/Query/Entertainment/Education/Course/useCourseDetailsQuery";
import CourseForm from "../../../../components/Entertainment/Education/Course/course_form";

export default function CourseUpdate() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the titleId from navigation state
  const titleId = location.state?.titleId;

  const { courseDetails, isLoading } = useCourseDetailsQuery(Number(id))

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  if (!titleId || !courseDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Episode Context. Please return to the Comic Details page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Go Back</button>
      </div>
    );
  }


  const formDefaults = {
    id: String(courseDetails.id),
    name: courseDetails.name,
    price: courseDetails.price,
    thumbnail: courseDetails.thumbnail,
    file_path: courseDetails?.file,
    grade_id: Number(titleId)
  };

  return (
    <div className="p-6 min-h-screen">
      <CourseForm
        mode="edit"
        grade_id={String(titleId)}
        defaultValues={formDefaults}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}