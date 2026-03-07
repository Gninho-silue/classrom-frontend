import { useShow, useBack } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, Hash } from "lucide-react";

export default function DepartmentShow() {
    const { query: queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const goBack = useBack();
    const record = data?.data;

    if (isLoading) {
        return (
            <ShowView>
                <ShowViewHeader title="Loading Department..." />
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </ShowView>
        );
    }

    if (!record) {
        return (
            <ShowView>
                <ShowViewHeader title="Department Not Found" />
                <div className="flex h-96 items-center justify-center flex-col gap-4">
                    <p className="text-muted-foreground font-medium text-lg">The department you're looking for does not exist.</p>
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
                    <div className="h-32 bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-transparent flex items-center justify-center">
                        <Building2 className="size-16 text-amber-500/40" />
                    </div>
                    <CardContent className="pt-6 pb-8 text-center">
                        <Badge variant="outline" className="font-mono text-sm mb-3">{record.code}</Badge>
                        <h2 className="text-2xl font-bold tracking-tight">{record.name}</h2>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            {record.description || "No description provided."}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-card/50 backdrop-blur-md">
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="size-5 text-primary" />
                            Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Hash className="size-4" />
                                <span className="text-sm font-medium">Code</span>
                            </div>
                            <Badge variant="outline" className="font-mono">{record.code}</Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="size-4" />
                                <span className="text-sm font-medium">Created</span>
                            </div>
                            <span className="text-sm font-semibold">{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
}
