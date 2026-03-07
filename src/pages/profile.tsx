import { useGetIdentity, useLogout } from "@refinedev/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials, type Identity } from "@/components/refine-ui/layout/user-avatar";
import { LogOut, Mail, ShieldCheck, User } from "lucide-react";

const roleColor: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  teacher: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function ProfilePage() {
  const { data: user, isLoading } = useGetIdentity<Identity>();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Card className="border-none shadow-md bg-card/50">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="size-5 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="size-24 border-4 border-primary/10 shadow-xl shrink-0">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Full Name</p>
                <p className="text-xl font-bold">{user.name}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Email</p>
                    <p className="text-sm font-semibold break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Role</p>
                    <Badge
                      variant="outline"
                      className={`capitalize font-semibold ${roleColor[user.role ?? ""] ?? ""}`}
                    >
                      {user.role ?? "—"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="gap-2"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
