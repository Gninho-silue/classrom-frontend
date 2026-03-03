import { useShow, useBack, useList } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { toast } from "sonner";
import {
    Calendar,
    Users,
    BookOpen,
    User,
    Info,
    Clock,
    Hash,
    Building2,
    CalendarDays,
    Copy,
    Mail,
    UserPlus,
    LayoutDashboard
} from "lucide-react";

export default function ClassShow() {
    const { query: queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const goBack = useBack();

    const record = data?.data;

    const { query: studentsQuery } = useList({
        resource: record?.id ? `classes/${record.id}/users` : "",
        filters: [{ field: 'role', operator: 'eq', value: 'student' }],
        queryOptions: {
            enabled: !!record?.id
        }
    });

    const students = studentsQuery?.data?.data || [];
    const isStudentsLoading = studentsQuery?.isLoading;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'inactive': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'archived': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const copyInviteCode = () => {
        if (record?.inviteCode) {
            navigator.clipboard.writeText(record.inviteCode);
            toast.success("Invite code copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <ShowView>
                <ShowViewHeader title="Loading Class..." />
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </ShowView>
        );
    }

    if (!record) {
        return (
            <ShowView>
                <ShowViewHeader title="Class Not Found" />
                <div className="flex h-96 items-center justify-center flex-col gap-4">
                    <p className="text-muted-foreground font-medium text-lg">The class you are looking for does not exist.</p>
                    <Button onClick={() => goBack()}>Back to List</Button>
                </div>
            </ShowView>
        );
    }

    return (
        <ShowView>
            <ShowViewHeader
                title={record.name}
            />
            <div className="space-y-6">
                {/* Hero Section with Banner */}
                <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-lg border group">
                    {record?.bannerUrl ? (
                        <img
                            src={record.bannerUrl}
                            alt={record.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-background flex items-center justify-center">
                            <GraduationCap className="size-24 text-primary/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(record?.status || 'active')}>
                                        {record?.status?.toUpperCase() || 'ACTIVE'}
                                    </Badge>
                                    <Badge variant="outline" className="text-white border-white/20 bg-white/10 backdrop-blur-md">
                                        <BookOpen className="size-3 mr-1" />
                                        {record?.subject?.code}
                                    </Badge>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                    {record?.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/90">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 cursor-pointer hover:bg-white/20 transition-all font-mono text-sm" onClick={copyInviteCode}>
                                        <Hash className="size-4 text-primary-foreground" />
                                        <span>{record?.inviteCode}</span>
                                        <Copy className="size-3.5 ml-1 opacity-60" />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Users className="size-4" />
                                        <span>{record?.capacity} Capacity</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Building2 className="size-4" />
                                        <span>{record?.department?.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="bg-white text-black hover:bg-white/90 shadow-xl" onClick={copyInviteCode}>
                                    <UserPlus className="size-4 mr-2" />
                                    Invite Students
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 h-12 p-1.5 bg-muted/50 backdrop-blur-sm rounded-xl">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <LayoutDashboard className="size-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="people" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Users className="size-4 mr-2" />
                            People
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-md">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Info className="size-5 text-primary" />
                                            Class Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Description</h3>
                                        <p className="text-foreground/80 leading-relaxed text-lg italic">
                                            {record?.description || "Welcome to our class! We'll explore exciting topics together. No specific overview provided yet."}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-md">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <CalendarDays className="size-5 text-primary" />
                                            Weekly Roster
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        {record?.schedules && record.schedules.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {record.schedules.map((schedule: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-br from-muted/50 to-transparent hover:shadow-sm transition-all group">
                                                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                            <Clock className="size-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-base capitalize">{schedule.day}</p>
                                                            <p className="text-sm text-muted-foreground font-medium">
                                                                {schedule.startTime} - {schedule.endTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-2xl border border-dashed border-primary/20">
                                                <Calendar className="size-12 text-muted-foreground/30 mb-3" />
                                                <p className="text-base text-muted-foreground font-semibold">No active schedule.</p>
                                                <p className="text-sm text-muted-foreground/60 max-w-[200px] mt-1">Check back later for updated session times.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-8">
                                <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-md">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <User className="size-5 text-primary" />
                                            Instructor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <Avatar className="size-24 border-4 border-primary/10 shadow-xl">
                                                <AvatarImage src={record?.teacher?.image} alt={record?.teacher?.name} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                                                    {(record?.teacher?.name || "U")[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-xl font-bold tracking-tight">{record?.teacher?.name}</h3>
                                                <p className="text-sm font-medium text-primary bg-primary/5 px-2.5 py-0.5 rounded-full inline-block mt-1">Head Instructor</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground/80 font-medium max-w-[200px]">
                                                Leading this class since {new Date(record.createdAt).toLocaleDateString()}.
                                            </p>
                                            <Button variant="outline" className="w-full rounded-xl gap-2 mt-4 transition-colors hover:bg-primary hover:text-white" asChild>
                                                <a href={`mailto:${record?.teacher?.email}`}>
                                                    <Mail className="size-4" />
                                                    Contact via Email
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-md">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <GraduationCapIcon className="size-5 text-primary" />
                                            Course Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Capacity</span>
                                            <span className="text-sm font-bold bg-muted px-2 py-0.5 rounded-md">{record?.capacity} seats</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Enrolled</span>
                                            <span className="text-sm font-bold bg-muted px-2 py-0.5 rounded-md">{students.length} students</span>
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Share this Class</label>
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-background border shadow-inner">
                                                <code className="flex-1 text-xs font-mono font-bold pl-2 select-all">{record?.inviteCode}</code>
                                                <Button size="icon" variant="ghost" className="size-8 rounded-lg" onClick={copyInviteCode}>
                                                    <Copy className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="people" className="mt-0">
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-3 text-primary">
                                    Teachers
                                    <Badge variant="outline" className="ml-2 font-mono">1 member</Badge>
                                </h3>
                                <div className="p-4 rounded-xl border flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                                    <Avatar className="size-12 border-2 border-primary/20 shadow-sm group-hover:scale-105 transition-transform">
                                        <AvatarImage src={record?.teacher?.image} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                            {(record?.teacher?.name || "U")[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg">{record?.teacher?.name}</p>
                                        <p className="text-sm text-muted-foreground font-medium">{record?.teacher?.email}</p>
                                    </div>
                                    <Badge className="bg-primary hover:bg-primary shadow-sm px-3">Owner</Badge>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        Students
                                        <Badge variant="secondary" className="font-mono">{students.length} enrolled</Badge>
                                    </h3>
                                    <Button variant="ghost" size="sm" className="gap-2 text-primary font-bold" onClick={copyInviteCode}>
                                        <UserPlus className="size-4" />
                                        Add Students
                                    </Button>
                                </div>
                                {isStudentsLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
                                        ))}
                                    </div>
                                ) : students.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {students.map((student: any) => (
                                            <div key={student.id} className="p-4 rounded-xl border flex items-center gap-4 hover:bg-muted/20 hover:border-primary/20 transition-all group">
                                                <Avatar className="size-10 border border-border group-hover:scale-110 transition-transform">
                                                    <AvatarImage src={student.image} />
                                                    <AvatarFallback className="bg-muted text-foreground font-semibold">
                                                        {(student.name || "S")[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-bold truncate">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] h-5 bg-background shadow-xs">STUDENT</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-muted/10 rounded-3xl border border-dashed flex flex-col items-center">
                                        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <Users className="size-8 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-xl font-bold text-muted-foreground mb-1">No students yet</p>
                                        <p className="text-sm text-muted-foreground/60 max-w-xs mb-6">
                                            Invite your first student using the class invite code or code generated below.
                                        </p>
                                        <Button className="rounded-xl px-6 font-bold" onClick={copyInviteCode}>
                                            <Copy className="size-4 mr-2" />
                                            Copy Invite Code
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ShowView>
    );
}

function GraduationCap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

function GraduationCapIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

