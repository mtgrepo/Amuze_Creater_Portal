import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThumbnailIcon } from "@react-pdf-viewer/default-layout"
import { Eye } from "lucide-react"

interface Props {
    id: number,
    name: string,
    thumbnail: string,
    likes: number,
    views: number
}

export default function PopularCard({data} : {data: Props}) {
  return (
    <Card>
  <CardHeader>
    <CardTitle>{data?.name}</CardTitle>
  </CardHeader>
  <CardContent>
    <img src={data?.thumbnail} alt="img" />
  </CardContent>
  <CardFooter>
    <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
            <Eye />
            {data?.views}
        </div>
                <div className="flex flex-row gap-3">
            <ThumbnailIcon />
            {data?.likes}
        </div>
    </div>
  </CardFooter>
</Card>
  )
}
