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
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      <StatCard
        title="Total Published Contents"
        value={statsCount?.published_contents || 0}
        previousValue="213"
        icon={BookOpen}
        accent="bg-primary text-primary-foreground"
      />
      <StatCard
        title="Total Revenue"
        value={statsCount?.income || 0}
        previousValue="143"
        icon={DollarSign}
        accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      />
      <StatCard
        title="Total Followers"
        value={statsCount?.followers || 0}
        previousValue="147"
        icon={Users}
        accent="bg-secondary"
      />
      <EngagementStatCard
        title="Total Engagement"
        value={statsCount?.likes + statsCount?.views + statsCount?.comments}
        previousValue={335}
        metrics={[
          { label: "Views", value: statsCount?.views, icon: Eye },
          { label: "Likes", value: statsCount?.likes, icon: ThumbsUp },
          { label: "Comments", value: statsCount?.comments, icon: MessageCircle },
        ]}
      />
    </div>
  );
}
