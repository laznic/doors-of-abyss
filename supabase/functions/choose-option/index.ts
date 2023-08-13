// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { optionId } = await req.json();

  const { data: option, error: optionError } = await supabaseClient
    .from("options")
    .select(
      `
      decision_target_chapter_id,
      decision_go_to_chapter_id,
      go_to_chapter_id
    `,
    )
    .eq("id", optionId)
    .single();

  if (optionError) {
    return new Response(JSON.stringify({ error: optionError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const { error: decisionError } = await supabaseClient
    .from("decisions")
    .insert({
      chapter_id: option.decision_target_chapter_id,
      go_to_chapter_id: option.decision_go_to_chapter_id,
    });

  if (decisionError) {
    return new Response(JSON.stringify({ error: decisionError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const { data: nextChapter } = await supabaseClient
    .from("chapters")
    .select(
      `
        id,
        text,
        image,
        next_chapter_id,
        is_last,
        loop_sound,
        decisions!decisions_chapter_id_fkey(
          id,
          go_to_chapter_id
        ),
        actions!actions_chapter_id_fkey(
          action_type,
          go_to_chapter_id
        ),
        options!options_chapter_id_fkey(
          id,
          text,
          go_to_chapter_id
        )
      `,
    )
    .eq("id", option.go_to_chapter_id)
    .order("id", { foreignTable: "decisions", ascending: false })
    .limit(1, { foreignTable: "decisions" })
    .single();

  return new Response(JSON.stringify(nextChapter), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
