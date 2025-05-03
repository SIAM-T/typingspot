import { notFound } from "next/navigation";
import { lessons, Lesson } from "../page";
import { supabase } from "@/lib/supabase/config";
import { PracticeContent } from "./PracticeContent";

interface Props {
  params: {
    snippetId: string;
  };
}

export default async function PracticePage({ params }: Props) {
  // First try to find a lesson
  const lesson = lessons.find((l: Lesson) => l.id === params.snippetId);

  if (lesson) {
    return <PracticeContent lesson={lesson} />;
  }

  // If no lesson found, try to find a code snippet
  const { data: snippet, error } = await supabase
    .from("code_snippets")
    .select("*")
    .eq("id", params.snippetId)
    .single();

  if (error || !snippet) {
    notFound();
  }

  return <PracticeContent snippet={snippet} />;
} 