import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useList } from "@refinedev/core";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubjectCreate() {
  const {
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: { resource: "subjects", action: "create" },
  });

  const { result: deptResult } = useList({
    resource: "departments",
    pagination: { pageSize: 1000 },
  });
  const departments = deptResult.data ?? [];

  return (
    <CreateView>
      <CreateViewHeader title="Create Subject" />
      <Card className="border-none shadow-md bg-card/50 backdrop-blur-md max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Algorithms"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g. CS301"
                  {...register("code", { required: "Code is required" })}
                />
                {errors.code && <p className="text-destructive text-sm">{errors.code.message as string}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Department is required", validate: (v) => Number(v) > 0 || "Department is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && <p className="text-destructive text-sm">{errors.departmentId.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the subject..."
                rows={3}
                {...register("description")}
              />
            </div>
            <Button type="submit" disabled={formLoading} className="w-full md:w-auto">
              {formLoading ? "Creating..." : "Create Subject"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </CreateView>
  );
}
