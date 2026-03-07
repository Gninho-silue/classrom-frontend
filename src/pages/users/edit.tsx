import { useForm } from "@refinedev/react-hook-form";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleColors: Record<string, string> = {
  admin: "text-rose-500",
  teacher: "text-blue-500",
  student: "text-emerald-500",
};

export default function UserEdit() {
  const {
    refineCore: { formLoading, onFinish, query },
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    refineCoreProps: { resource: "users", action: "edit" },
  });

  const isPageLoading = query?.isLoading;
  const currentRole = watch("role");

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
      <EditViewHeader title="Edit User" />
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-md max-w-2xl">
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onFinish)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message as string}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role *</Label>
              <input type="hidden" {...register("role", { required: "Role is required" })} />
              <Select
                value={currentRole || ""}
                onValueChange={(val) => setValue("role", val, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <span className={roleColors.student}>Student</span>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <span className={roleColors.teacher}>Teacher</span>
                  </SelectItem>
                  <SelectItem value="admin">
                    <span className={roleColors.admin}>Admin</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-destructive text-sm">{errors.role.message as string}</p>
              )}
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
