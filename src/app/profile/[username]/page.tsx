"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/context/auth-context";
import { motion } from "framer-motion";
import { Share2, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  tests_completed: number;
  average_wpm: number;
  average_accuracy: number;
  best_wpm: number;
  xp: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  required_score: number;
  achievement_type: string;
  unlocked_at?: string;
  progress?: number;
}

interface WpmDataPoint {
  date: string;
  wpm: number;
}

interface AccuracyDataPoint {
  date: string;
  accuracy: number;
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedAvatarUrl, setEditedAvatarUrl] = useState("");
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<AccuracyDataPoint[]>([]);
  const isOwnProfile = user?.id === profile?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First check if user exists
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Failed to load profile. Please try again later.");
          setLoading(false);
          return;
        }

        if (!profileData) {
          setProfile(null);
          setError("Profile not found. The user might have changed their username or deleted their account.");
          setLoading(false);
          return;
        }

        setProfile(profileData);
        setEditedUsername(profileData.username);
        setEditedAvatarUrl(profileData.avatar_url || "");

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from("achievements")
          .select(`
            *,
            user_achievements!left(unlocked_at, progress)
          `)
          .eq("user_achievements.user_id", profileData.id);

        if (achievementsError) {
          console.error("Error fetching achievements:", achievementsError);
          return;
        }

        setAchievements(achievementsData.map(achievement => ({
          ...achievement,
          unlocked_at: achievement.user_achievements?.[0]?.unlocked_at,
          progress: achievement.user_achievements?.[0]?.progress || 0
        })));

        // If viewing own profile, fetch detailed stats
        if (user?.id === profileData.id) {
          const { data: results, error: statsError } = await supabase
            .from('typing_results')
            .select('*')
            .eq('user_id', profileData.id)
            .order('created_at', { ascending: true });

          if (!statsError && results) {
            const wpmData = results.map(r => ({
              date: new Date(r.created_at).toLocaleDateString(),
              wpm: r.wpm
            }));
            const accuracyData = results.map(r => ({
              date: new Date(r.created_at).toLocaleDateString(),
              accuracy: r.accuracy
            }));
            setWpmHistory(wpmData);
            setAccuracyHistory(accuracyData);
          }
        }

      } catch (error) {
        console.error("Error:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, user?.id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Profile link copied!",
        description: "Share your typing stats with friends.",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editedUsername.trim()) return;

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: editedUsername.trim(),
          avatar_url: editedAvatarUrl
        }
      });

      if (updateError) throw updateError;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find a profile with that username."}
          </p>
          <Button onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editedAvatarUrl}
                  onChange={(e) => setEditedAvatarUrl(e.target.value)}
                  placeholder="Avatar URL"
                  className="max-w-xs"
                />
                <Input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  placeholder="Username"
                  className="max-w-xs"
                />
              </div>
            ) : (
              <>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl text-primary-foreground">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">{profile.username}</h1>
                    <div className="flex gap-2">
                      {isOwnProfile && !isEditing && (
                        <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {isOwnProfile && (
                        <Button variant="outline" size="icon" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </>
            )}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">XP</h3>
            <p className="text-3xl font-bold">{profile.xp.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">Tests</h3>
            <p className="text-3xl font-bold">{profile.tests_completed}</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">Avg. WPM</h3>
            <p className="text-3xl font-bold">{Math.round(profile.average_wpm)}</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-lg font-semibold mb-2">Best WPM</h3>
            <p className="text-3xl font-bold">{Math.round(profile.best_wpm)}</p>
          </div>
        </div>

        {isOwnProfile && wpmHistory.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <div className="space-y-8">
              <div className="h-[300px]">
                <h3 className="text-lg font-semibold mb-4">WPM History</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wpmHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[300px]">
                <h3 className="text-lg font-semibold mb-4">Accuracy History</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked_at
                    ? "bg-card border-primary"
                    : "bg-card/50 border-border"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <img
                    src={achievement.icon_url}
                    alt={achievement.name}
                    className={`w-16 h-16 ${!achievement.unlocked_at && "opacity-50 grayscale"}`}
                  />
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked_at ? (
                    <span className="text-xs text-primary">
                      Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </span>
                  ) : (
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((achievement.progress || 0) / achievement.required_score) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 