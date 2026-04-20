import { useLocation, useParams } from "react-router-dom";
import { useGradeDetailsQuery } from "../../../../composable/Query/Entertainment/Education/Grades/useGradeDetailsQuery";
import GradesForm from "../../../../components/Entertainment/Education/Grades/grades_form";

export default function GradeUpdate() {
  const { state } = useLocation();
  const { id } = useParams();


  const { gradeDetails, isLoading} = useGradeDetailsQuery(Number(id)!);

  const grades = gradeDetails?.grade || state;

  console.log("gradedata", grades)

  if (isLoading && !gradeDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading comics data...</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <GradesForm
        mode="edit"
        defaultValues={{
          id: id,
          name: grades.name,
          is_old_question: grades.description,
          thumbnail: grades.thumbnail,
        }}
      />
    </div>
  );
}
