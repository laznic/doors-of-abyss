import { Database } from "@/database.types";
import supabase from "@/lib/supabase";
import { PostgrestBuilder } from "@supabase/postgrest-js";
import { Howl } from "howler";
import React, {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from "react";

export interface ChapterContextType {
  currentChapter: Partial<
    Database["public"]["Tables"]["chapters"]["Row"] & {
      notes?: Database["public"]["Tables"]["notes"]["Row"][];
      actions?: Database["public"]["Tables"]["actions"]["Row"][];
      decisions?: Database["public"]["Tables"]["decisions"]["Row"][];
      options?: Database["public"]["Tables"]["options"]["Row"][];
    }
  > | null;
  nextChapter:
    | (Database["public"]["Tables"]["chapters"]["Row"] & {
        notes?: Database["public"]["Tables"]["notes"]["Row"][];
        actions?: Database["public"]["Tables"]["actions"]["Row"][];
        decisions?: Database["public"]["Tables"]["decisions"]["Row"][];
        options?: Database["public"]["Tables"]["options"]["Row"][];
      })
    | null;
  goToNextChapter?: (id?: number, isOption?: boolean) => void;
  shouldKeepNotes: boolean;
  inIntro: boolean;
  passIntro: () => void;
}

export const ChapterContext = createContext<ChapterContextType>({
  currentChapter: { id: 1, notes: [] },
  nextChapter: null,
  goToNextChapter: () => null,
  shouldKeepNotes: false,
  inIntro: true,
  passIntro: () => null,
});

const initialState = {
  currentChapter: { id: 1, notes: [] },
  nextChapter: null,
  shouldKeepNotes: false,
  inIntro: true,
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

        const newCurrentChapter = state.shouldKeepNotes
          ? { ...currentChapter, notes: state.currentChapter?.notes }
          : currentChapter;

        setState({ currentChapter: newCurrentChapter });

        // One of these exists
        const nextChapterId =
          currentChapter?.actions?.[0]?.go_to_chapter_id ??
          currentChapter?.decisions?.[0]?.go_to_chapter_id ??
          currentChapter?.next_chapter_id;
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
    [
      state.currentChapter?.id,
      state.currentChapter?.notes,
      state.shouldKeepNotes,
    ],
  );

  async function goToNextChapter(id?: number, isOption?: "action" | "option") {
    new Howl({
      src: [`/sounds/exhale.mp3`],
    }).play();

    if (!id) {
      const shouldKeepNotes =
        Array.isArray(state.nextChapter.notes) &&
        state.nextChapter.notes.length > 0;

      return setState({ currentChapter: state.nextChapter, shouldKeepNotes });
    }

    if (!isOption) {
      const { data: nextChapter } = await fetchChapterFromSupabase(id);

      setState({ currentChapter: nextChapter });
      return;
    }

    const { data: nextChapter } = await supabase.functions.invoke(
      "choose-option",
      { body: { optionId: id } },
    );

    setState({ currentChapter: nextChapter });
  }

  function passIntro() {
    if (!state.inIntro) return;

    new Howl({
      src: [`/sounds/exhale.mp3`],
    }).play();

    setState({ inIntro: false });
  }

  const contextValue = {
    ...state,
    goToNextChapter,
    passIntro,
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
    .eq("id", chapterId)
    .order("id", { foreignTable: "decisions", ascending: false })
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

function fetchNotesByAction(actionType?: ActionType) {
  if (!actionType || actionType === "DRAW" || actionType === "NOTEBOOK_WRITE")
    return [];

  if (actionType === "SHOW_PICTURE") {
    return supabase.rpc("get_random_image");
  }

  return supabase
    .from("notes")
    .select("id, text")
    .is("image", null)
    .limit(24)
    .order("id", { ascending: false });
}
