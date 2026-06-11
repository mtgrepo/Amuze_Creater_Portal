import {
  BookOpen,
  DollarSign,
  Eye,
  MessageCircle,
  ThumbsUp,
  Users,
} from "lucide-react";
import { StatCard } from "../Dashboard/status_card";
import { EngagementStatCard } from "../engagement_status_card";
import { useStatsCountQuery } from "@/composable/Query/Report/useStatsCountQuery";
export default function StatsReportCard() {
  const { statsCount } = useStatsCountQuery();
  console.log("data in component", statsCount)
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      <StatCard
        title="Total Published Contents"
        value={statsCount?.publishedContents?.currentMonth || 0}
        previousValue={statsCount?.publishedContents?.previousMonth}
        percent={statsCount?.publishedContents.percentage || 0}
        icon={BookOpen}
        accent="bg-primary text-primary-foreground"
      />
      <StatCard
        title="Total Revenue"
        value={statsCount?.income?.currentMonth || 0}
        previousValue={statsCount?.income?.previousMonth}
        percent={statsCount?.income?.percentage || 0}
        icon={DollarSign}
        accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      />
      <StatCard
        title="Total Followers"
        value={statsCount?.followers?.currentMonth || 0}
        previousValue={statsCount?.followers?.previousMonth}
        percent={statsCount?.followers.percentage || 0}
        icon={Users}
        accent="bg-secondary"
      />
      <EngagementStatCard
        title="Total Engagement"
        value={(statsCount?.likes?.currentMonth || 0) + (statsCount?.views?.currentMonth || 0) + (statsCount?.comments?.currentMonth || 0)}
        percentage={(statsCount?.likes.percentage || 0) + (statsCount?.views.percentage || 0) + (statsCount?.comments.percentage || 0)}
        previousValue={335}
        metrics={[
          { label: "Views", value: statsCount?.views?.currentMonth || 0, icon: Eye },
          { label: "Likes", value: statsCount?.likes?.currentMonth || 0, icon: ThumbsUp },
          { label: "Comments", value: statsCount?.comments?.currentMonth || 0, icon: MessageCircle },
        ]}
      />
    </div>
  );
}
