"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/auth/types";
import { useRouter } from "next/navigation";
import { auth, useSession } from "@/lib/auth/client";
import { UAParser } from "ua-parser-js";
import { BadgeCheckIcon, Laptop, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function UserCard(props: {
  session: Session;
  activeSessions: Session["session"][];
}) {
  const router = useRouter();
  const { data } = useSession();
  const session = data || props.session;
  const [isTerminating, setIsTerminating] = useState<string>();
  const [activeSessions, setActiveSessions] = useState(props.activeSessions);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState(false);

  const removeActiveSession = (id: string) =>
    setActiveSessions(activeSessions.filter((session) => session.id !== id));

  const handleTerminateSession = async (
    sessionId: string,
    sessionToken: string
  ) => {
    setIsTerminating(sessionId);
    const res = await auth.revokeSession({
      token: sessionToken,
    });

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Session terminated successfully");
      removeActiveSession(sessionId);
    }
    if (sessionId === props.session.session.id) {
      router.refresh();
    }
    setIsTerminating(undefined);
  };

  const handleSendVerificationEmail = async () => {
    await auth.sendVerificationEmail(
      {
        email: session.user.email,
      },
      {
        onRequest() {
          setEmailVerificationPending(true);
        },
        onError(context) {
          setEmailVerificationPending(false);
          toast.error(
            `Failed to send verification email: ${context.error.message}`
          );
        },
        onSuccess() {
          setEmailVerificationPending(false);
          toast.success("Verification email sent successfully");
        },
      }
    );
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>User Detail</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-8">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={session?.user.image || ""}
                alt={session?.user.name}
              />
              <AvatarFallback>{session?.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-foreground truncate font-semibold">
                  {session?.user.name}
                </span>
              </div>
              <span className="text-muted-foreground truncate text-xs font-normal">
                {session?.user.email}
              </span>
              {session.user.emailVerified ? (
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600 mt-1.5"
                >
                  <BadgeCheckIcon />
                  Verified
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          {session.user.emailVerified ? null : (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTitle className="text-yellow-600">
                Verify Your Email Address
              </AlertTitle>
              <AlertDescription>
                Please verify your email address. Check your inbox for the
                verification email. If you havent received the email, click the
                button below to resend.
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                  onClick={handleSendVerificationEmail}
                  disabled={emailVerificationPending}
                >
                  {emailVerificationPending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="border-1-2 px-2 w-max gap-1 flex flex-col">
          <p className="text-xs font-medium">Active Sessions</p>
          {activeSessions
            ?.filter((session) => session.userAgent)
            .map((session) => {
              return (
                <div key={session.id}>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    {new UAParser(session.userAgent || "").getDevice().type ===
                    "mobile" ? (
                      <Smartphone size={16} />
                    ) : (
                      <Laptop size={16} />
                    )}
                    {new UAParser(session.userAgent || "").getOS().name},{" "}
                    {new UAParser(session.userAgent || "").getBrowser().name}
                    <button
                      className="text-destructive opacity-80 cursor-pointer text-xs border-muted-foreground "
                      onClick={() =>
                        handleTerminateSession(session.id, session.token)
                      }
                    >
                      {isTerminating === session.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : session.id === props.session?.session.id ? (
                        "Sign Out"
                      ) : (
                        "Terminate"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
