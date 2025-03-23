"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  useEffect(() => {
    async function checkUserExists() {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/users/check?userId=${user.id}`);
        const data = await response.json();
        setIsUserCreated(data.exists);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    }
    
    if (isLoaded && user) {
      checkUserExists();
    }
  }, [isLoaded, user]);

  const createUserProfile = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName || "User",
          lastName: user.lastName || "",
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsUserCreated(true);
        toast.success("Profile created successfully!");
      } else {
        toast.error(data.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create profile");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {user.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-medium">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              {!isUserCreated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Complete Your Profile Setup</h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    We need to create your profile in our database to track your quiz attempts and progress.
                  </p>
                  <Button 
                    onClick={createUserProfile} 
                    disabled={isCreating}
                    className="mt-3"
                  >
                    {isCreating ? "Creating..." : "Complete Setup"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          {isUserCreated && (
            <Button onClick={() => window.location.href = "/dashboard/practice"}>
              Go to Practice Tests
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 