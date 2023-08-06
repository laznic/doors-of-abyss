import { Database } from "@/database.types";
import supabase from "@/lib/supabase";
import { PostgrestBuilder } from "@supabase/postgrest-js";
import React, {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from "react";

interface ChapterContextType {
  currentChapter:
    | (Database["public"]["Tables"]["chapters"]["Row"] & {
        notes?: Database["public"]["Tables"]["notes"]["Row"];
      })
    | null;
  nextChapter:
    | (Database["public"]["Tables"]["chapters"]["Row"] & {
        notes?: Database["public"]["Tables"]["notes"]["Row"];
      })
    | null;
  goToNextChapter?: () => void;
}

export const ChapterContext = createContext<ChapterContextType>({
  currentChapter: null,
  nextChapter: null,
  goToNextChapter: () => null,
});

const initialState = {
  currentChapter: null,
  nextChapter: null,
};

export function ChapterContextProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(
    function fetchChapterData() {
      async function fetchData() {
        const { data: currentChapter } = await fetchChapterFromSupabase(
          state.currentChapter?.id ?? 1,
        );
        setState({ currentChapter });

        // One of these exists
        const nextChapterId =
          currentChapter?.decisions?.[0]?.go_to_chapter_id ??
          currentChapter?.next_chapter_id ??
          1;
        const { data: nextChapter } = await fetchChapterFromSupabase(
          nextChapterId as number,
        );

        // There is only one action per chapter for now
        const { data: nextChapterNotes } = await fetchNotesByAction(
          nextChapter?.actions[0]?.action_type,
        );

        setState({ nextChapter: { ...nextChapter, notes: nextChapterNotes } });
      }

      fetchData();
    },
    [state.currentChapter?.id],
  );

  function goToNextChapter() {
    setState({ currentChapter: state.nextChapter });
  }

  const contextValue = {
    ...state,
    goToNextChapter,
  };

  return (
    <ChapterContext.Provider value={contextValue}>
      {children}
    </ChapterContext.Provider>
  );
}

export const useChapterContext = () => useContext(ChapterContext);

function reducer(state: ChapterContextType, next: Partial<ChapterContextType>) {
  return { ...state, ...next };
}

function fetchChapterFromSupabase(chapterId: number): ChapterFetchReturnType {
  return supabase
    .from("chapters")
    .select(
      `
      id,
      text,
      image,
      next_chapter_id,
      is_last,
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
    .eq("id", chapterId)
    .or("used.eq.false,is_default.eq.true", { foreignTable: "decisions" })
    .order("is_default", { foreignTable: "decisions", ascending: true })
    .returns<Partial<ChapterContextType>>()
    .limit(1, { foreignTable: "decisions" })
    .single();
}

type ChapterFetchReturnType = PostgrestBuilder<
  Database["public"]["Tables"]["chapters"]["Row"] & {
    decisions: Database["public"]["Tables"]["decisions"]["Row"][];
    actions: Database["public"]["Tables"]["actions"]["Row"][];
    options: Database["public"]["Tables"]["options"]["Row"][];
  }
>;

type ActionType = "DRAW" | "SHOW_PICTURE" | "NOTEBOOK_READ" | "NOTEBOOK_WRITE";

async function fetchNotesByAction(actionType?: ActionType) {
  if (!actionType || actionType === "DRAW" || actionType === "NOTEBOOK_WRITE")
    return [];

  if (actionType === "SHOW_PICTURE") {
    return supabase.rpc("get_random_image");
  }

  return supabase.from("notes").select("id, text").is("image", null);
}
