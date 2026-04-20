import { useParams } from "react-router-dom";
import CourseForm from "../../../../components/Entertainment/Education/Course/course_form";

export default function CourseCreate() {
    const {id} = useParams();
    // console.log("id", id) 
  return (
    <div>
        <CourseForm mode="add" grade_id={id!}/>
    </div>
  )
}
