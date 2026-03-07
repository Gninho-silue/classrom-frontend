import { useShow, useBack } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, Shield, User as UserIcon } from "lucide-react";

const roleColors: Record<string, string> = {
    admin: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    teacher: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function UserShow() {
    const { query: queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const goBack = useBack();
    const record = data?.data;

    if (isLoading) {
        return (
            <ShowView>
                <ShowViewHeader title="Loading User..." />
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </ShowView>
        );
    }

    if (!record) {
        return (
            <ShowView>
                <ShowViewHeader title="User Not Found" />
                <div className="flex h-96 items-center justify-center flex-col gap-4">
                    <p className="text-muted-foreground font-medium text-lg">The user you are looking for does not exist.</p>
                    <Button onClick={() => goBack()}>Back to List</Button>
                </div>
            </ShowView>
        );
    }

    return (
        <ShowView>
            <ShowViewHeader title={record.name} />
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="border-none shadow-md bg-card/50 backdrop-blur-md overflow-hidden">
                    <CardContent className="pt-8 pb-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="size-28 border-4 border-primary/10 shadow-xl">
                                <AvatarImage src={record.image} alt={record.name} />
                                <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                                    {(record.name || "U")[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{record.name}</h2>
                                <p className="text-muted-foreground">{record.email}</p>
                            </div>
                            <Badge className={`${roleColors[record.role] ?? ""} capitalize text-sm px-4 py-1`}>
                                {record.role}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserIcon className="size-5 text-primary" />
                            Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="size-4" />
                                <span className="text-sm font-medium">Email</span>
                            </div>
                            <span className="text-sm font-semibold">{record.email}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Shield className="size-4" />
                                <span className="text-sm font-medium">Role</span>
                            </div>
                            <Badge className={`${roleColors[record.role] ?? ""} capitalize`}>{record.role}</Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="size-4" />
                                <span className="text-sm font-medium">Verified</span>
                            </div>
                            <Badge variant={record.emailVerified ? "default" : "secondary"}>
                                {record.emailVerified ? "Yes" : "No"}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="size-4" />
                                <span className="text-sm font-medium">Joined</span>
                            </div>
                            <span className="text-sm font-semibold">{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
}
