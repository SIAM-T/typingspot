import { supabase } from "@/lib/supabase/config";
import { allCodeSnippets } from "@/lib/data/default-snippets";

async function updateSnippets() {
  try {
    // Optionally clear existing snippets
    // const { error: deleteError } = await supabase
    //   .from('code_snippets')
    //   .delete()
    //   .neq('id', '00000000-0000-0000-0000-000000000000');
    
    // if (deleteError) throw deleteError;

    // Insert new snippets in batches of 10
    const batchSize = 10;
    for (let i = 0; i < allCodeSnippets.length; i += batchSize) {
      const batch = allCodeSnippets.slice(i, i + batchSize);
      const { error } = await supabase
        .from('code_snippets')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        continue;
      }

      console.log(`Successfully inserted batch ${i / batchSize + 1}`);
    }

    console.log('All snippets updated successfully!');
  } catch (error) {
    console.error('Error updating snippets:', error);
  }
}

// Run the update
updateSnippets(); 