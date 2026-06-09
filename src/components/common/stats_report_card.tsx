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
export default function StatsReportCard() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      <StatCard
        title="Total Published Contents"
        value="200"
        previousValue="213"
        icon={BookOpen}
        accent="bg-primary text-primary-foreground"
      />
      <StatCard
        title="Total Revenue"
        value="$2,400"
        previousValue="143"
        icon={DollarSign}
        accent="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      />
      <StatCard
        title="Total Followers"
        value="1,240"
        previousValue="147"
        icon={Users}
        accent="bg-secondary"
      />
      <EngagementStatCard
        title="Total Engagement"
        value={346}
        previousValue={335}
        metrics={[
          { label: "Views", value: "46", icon: Eye },
          { label: "Likes", value: "200", icon: ThumbsUp },
          { label: "Comments", value: "100", icon: MessageCircle },
        ]}
      />
    </div>
  );
}
