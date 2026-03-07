import { useForm } from "@refinedev/react-hook-form";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DepartmentEdit() {
    const {
        refineCore: { formLoading, onFinish, query },
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        refineCoreProps: { resource: "departments", action: "edit" },
    });

    const isPageLoading = query?.isLoading;

    if (isPageLoading) {
        return (
            <EditView>
                <EditViewHeader title="Loading..." />
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </EditView>
        );
    }

    return (
        <EditView>
            <EditViewHeader title="Edit Department" />
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-md max-w-2xl">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Computer Science"
                                    {...register("name", { required: "Name is required" })}
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Code *</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. CS"
                                    {...register("code", { required: "Code is required" })}
                                />
                                {errors.code && <p className="text-destructive text-sm">{errors.code.message as string}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the department..."
                                rows={3}
                                {...register("description")}
                            />
                        </div>
                        <Button type="submit" disabled={formLoading} className="w-full md:w-auto">
                            {formLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </EditView>
    );
}
