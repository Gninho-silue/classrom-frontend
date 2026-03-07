import { useCustom } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

type OverviewStats = {
  totalUsers: number;
  totalClasses: number;
  totalSubjects: number;
  totalDepartments: number;
  totalEnrollments: number;
};

type CapacityItem = { classId: number; className: string; capacity: number; enrolled: number };
type EnrollmentTrend = { className: string; enrollments: number };
type DeptCount = { department: string; count: number };
type UserDist = { role: string; count: number };
type RecentEnrollment = { studentName: string; studentEmail: string; studentImage: string; className: string };
type RecentClass = { id: number; name: string; status: string; capacity: number; createdAt: string; teacherName: string; subjectName: string };

type DashboardData = {
  [key: string]: unknown;
  overview: OverviewStats;
  userDistribution: UserDist[];
  classesByDept: DeptCount[];
  capacityStatus: CapacityItem[];
  enrollmentTrends: EnrollmentTrend[];
  recentEnrollments: RecentEnrollment[];
  recentClasses: RecentClass[];
};

export default function Dashboard() {
  const { query } = useCustom<DashboardData>({
    url: `${BACKEND_BASE_URL}dashboard/stats`,
    method: "get",
  });

  const { isLoading } = query;
  // custom() returns { data: backendBody }, backendBody is { data: { overview, ... } }
  // so we need two levels of .data
  const stats = (query.data?.data as any)?.data as DashboardData | undefined;

  if (isLoading) {
    return (
      <div className="space-y-8 p-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading your classroom analytics...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const overview = stats?.overview;
  const overviewCards = [
    { title: "Total Users", value: overview?.totalUsers ?? 0, icon: Users, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-500" },
    { title: "Total Classes", value: overview?.totalClasses ?? 0, icon: GraduationCap, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-500" },
    { title: "Total Subjects", value: overview?.totalSubjects ?? 0, icon: BookOpen, color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-500" },
    { title: "Total Departments", value: overview?.totalDepartments ?? 0, icon: Building2, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-500" },
  ];

  const enrollmentTrends = stats?.enrollmentTrends ?? [];
  const capacityStatus = stats?.capacityStatus ?? [];
  const classesByDept = stats?.classesByDept ?? [];
  const userDistribution = stats?.userDistribution ?? [];
  const recentEnrollments = stats?.recentEnrollments ?? [];
  const recentClasses = stats?.recentClasses ?? [];

  const maxEnrollment = Math.max(...enrollmentTrends.map((e: EnrollmentTrend) => e.enrollments), 1);
  const maxDeptCount = Math.max(...classesByDept.map((d: DeptCount) => d.count), 1);

  const roleColors: Record<string, string> = {
    admin: "bg-rose-500",
    teacher: "bg-blue-500",
    student: "bg-emerald-500",
  };

  const totalUsers = userDistribution.reduce((acc: number, d: UserDist) => acc + d.count, 0) || 1;

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your classroom overview.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card) => (
          <Card key={card.title} className="border-none shadow-md bg-card/50 backdrop-blur-md overflow-hidden relative group hover:shadow-lg transition-shadow">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`} />
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-4xl font-extrabold tracking-tight mt-1">{card.value}</p>
                </div>
                <div className={`size-14 rounded-2xl bg-background/80 flex items-center justify-center shadow-sm ${card.iconColor}`}>
                  <card.icon className="size-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enrollment highlight */}
      <Card className="border-none shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden">
        <CardContent className="py-6 flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
            <p className="text-3xl font-extrabold tracking-tight">{overview?.totalEnrollments ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">students enrolled across all classes</p>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Top Enrolled Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {enrollmentTrends.length > 0 ? (
              <div className="space-y-4">
                {enrollmentTrends.map((trend: EnrollmentTrend, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-[200px]">{trend.className}</span>
                      <span className="font-bold text-primary">{trend.enrollments}</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                        style={{ width: `${(trend.enrollments / maxEnrollment) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No enrollment data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classes by Department */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              Classes by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {classesByDept.length > 0 ? (
              <div className="space-y-4">
                {classesByDept.map((dept: DeptCount, i: number) => {
                  const colors = ["from-blue-500 to-blue-400", "from-emerald-500 to-emerald-400", "from-violet-500 to-violet-400", "from-amber-500 to-amber-400", "from-rose-500 to-rose-400", "from-cyan-500 to-cyan-400"];
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[200px]">{dept.department ?? "Unassigned"}</span>
                        <span className="font-bold">{dept.count}</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-500`}
                          style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No department data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Status */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Class Capacity Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {capacityStatus.length > 0 ? (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {capacityStatus.map((cls: CapacityItem) => {
                  const pct = cls.capacity > 0 ? (cls.enrolled / cls.capacity) * 100 : 0;
                  const barColor = pct >= 90 ? "from-rose-500 to-rose-400" : pct >= 70 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";
                  return (
                    <div key={cls.classId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[180px]">{cls.className}</span>
                        <span className="text-xs font-mono">
                          <span className="font-bold">{cls.enrolled}</span>/{cls.capacity}
                          {pct >= 90 && <Badge variant="destructive" className="ml-2 text-[10px] h-4 px-1.5">Full</Badge>}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No classes yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="size-5 text-primary" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {userDistribution.length > 0 ? (
              <div className="space-y-6">
                {/* Bar visualization */}
                <div className="flex h-8 rounded-full overflow-hidden bg-muted">
                  {userDistribution.map((d: UserDist) => (
                    <div
                      key={d.role}
                      className={`${roleColors[d.role] ?? "bg-gray-500"} transition-all duration-500`}
                      style={{ width: `${(d.count / totalUsers) * 100}%` }}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="grid grid-cols-3 gap-4">
                  {userDistribution.map((d: UserDist) => (
                    <div key={d.role} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div className={`size-3 rounded-full ${roleColors[d.role] ?? "bg-gray-500"}`} />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground capitalize">{d.role}</p>
                        <p className="text-lg font-bold">{d.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No users yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Activity Feed + Recent Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentEnrollments.length > 0 ? (
              <div className="space-y-1">
                {recentEnrollments.map((e: RecentEnrollment, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <Avatar className="size-9 border">
                      <AvatarImage src={e.studentImage} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {(e.studentName || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{e.studentName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Enrolled in <span className="font-medium text-foreground">{e.className}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Classes */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              Latest Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentClasses.length > 0 ? (
              <div className="space-y-1">
                {recentClasses.map((cls: RecentClass) => (
                  <div key={cls.id} className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{cls.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {cls.teacherName} · {cls.subjectName}
                      </p>
                    </div>
                    <Badge
                      className={
                        cls.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }
                    >
                      {cls.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="size-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No classes yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
