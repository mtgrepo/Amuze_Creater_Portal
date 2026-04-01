import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RecentlyUploadTable } from "./RecentlyUpload/data_table";

export default function RecentlyUpload() {
const sampleData = [
  {
    id: 1,
    name: "Sunset in Bali",
    description: "Beautiful sunset at Kuta Beach.",
    likes: 120,
    views: 1024,
    rating: 4.8,
    is_published: "Published",
    status: "active",
    createdAt: "2026-03-20T14:35:00Z",
  },
  {
    id: 2,
    name: "Mountain Hiking",
    description: "Hiking experience in the Alps.",
    likes: 95,
    views: 876,
    rating: 4.5,
    is_published: "Draft",
    status: "inactive",
    createdAt: "2026-02-18T09:20:00Z",
  },
  {
    id: 3,
    name: "City Lights",
    description: "Night photography in New York.",
    likes: 210,
    views: 1345,
    rating: 4.9,
    is_published: "Published",
    status: "active",
    createdAt: "2026-01-05T18:50:00Z",
  },
  {
    id: 4,
    name: "Forest Trail",
    description: "Morning walk in the woods.",
    likes: 78,
    views: 543,
    rating: 4.2,
    is_published: "Published",
    status: "active",
    createdAt: "2026-03-01T11:10:00Z",
  },
  {
    id: 5,
    name: "Beach Volleyball",
    description: "Fun day at the beach.",
    likes: 56,
    views: 432,
    rating: 4.0,
    is_published: "Draft",
    status: "inactive",
    createdAt: "2026-03-10T08:45:00Z",
  },
];
  return (
    <div className="w-full">
        <Card>
            <CardHeader>
                <CardTitle>Recently Upload</CardTitle>
            </CardHeader>
            <CardContent>
                <RecentlyUploadTable  data={sampleData}/>
            </CardContent>
        </Card>
    </div>
  )
}
