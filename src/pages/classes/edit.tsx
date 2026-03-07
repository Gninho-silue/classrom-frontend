import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBack, useList } from "@refinedev/core";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema } from "@/lib/schema";
import * as z from "zod";
import { useForm } from "@refinedev/react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import UploadWidget from "@/components/upload-widget";

// Edit schema: banner optional (might already exist)
const classEditSchema = classSchema.extend({
  bannerUrl: z.string().optional(),
  bannerCldPubId: z.string().optional(),
});

const ClassEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classEditSchema),
    refineCoreProps: {
      resource: "classes",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const isPageLoading = query?.isLoading;

  const { query: subjectsQuery } = useList({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });

  const { query: teachersQuery } = useList({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  });

  const subjects = subjectsQuery?.data?.data ?? [];
  const teachers = teachersQuery?.data?.data ?? [];

  const onSubmit = async (values: z.infer<typeof classEditSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const bannerPublicId = form.watch("bannerCldPubId");
  const setBannerImage = (file: any, field: any) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, { shouldValidate: true, shouldDirty: true });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", { shouldValidate: true, shouldDirty: true });
    }
  };

  if (isPageLoading) {
    return (
      <EditView>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </EditView>
    );
  }

  return (
    <EditView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Edit Class</h1>
      <div className="intro-row">
        <p>Update the class details below.</p>
        <Button variant="outline" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold">Edit Class</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image</FormLabel>
                      <FormDescription>Upload a new banner or keep the existing one.</FormDescription>
                      <FormControl>
                        <UploadWidget
                          value={field.value ? { url: field.value, publicId: bannerPublicId ?? "" } : null}
                          onChange={(file: any) => setBannerImage(file, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Biology - Section A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value?.toString()}
                          disabled={subjectsQuery?.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((s: any) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name} ({s.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={teachersQuery?.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((t: any) => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description about the class" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="inline-block mr-2 size-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default ClassEdit;
