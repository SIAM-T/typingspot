import { CodeTypingTest } from "./CodeTypingTest";
import { supabase } from "@/lib/supabase/config";
import { notFound } from "next/navigation";

interface Props {
  params: {
    snippetId: string;
  };
}

export default async function PracticePage({ params }: Props) {
  if (!params?.snippetId) {
    notFound();
  }

  const { data: snippet, error } = await supabase
    .from("code_snippets")
    .select("*")
    .eq("id", params.snippetId)
    .single();

  if (error || !snippet) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{snippet.title}</h1>
        <p className="text-muted-foreground mb-8">{snippet.description}</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
              {snippet.language}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
              {snippet.difficulty}
            </span>
          </div>
          <CodeTypingTest snippet={snippet} />
        </div>
      </div>
    </div>
  );
} 