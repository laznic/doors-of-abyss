import { Database } from "@/database.types"
import supabase from "@/lib/supabase"
import { PostgrestBuilder } from "@supabase/postgrest-js"
import React, { useContext, createContext, ReactNode, useEffect, useReducer } from "react"

interface ChapterContextType {
  currentChapterId: number,
  currentChapter: Database['public']['Tables']['chapters']['Row'] | null,
  nextChapter: Database['public']['Tables']['chapters']['Row'] | null
}

export const ChapterContext = createContext<ChapterContextType>({
  currentChapterId: 1,
  currentChapter: null,
  nextChapter: null
})

const initialState = {
  currentChapterId: 1,
  currentChapter: null,
  nextChapter: null
}

export function ChapterContextProvider (props: { children: ReactNode }) {
  const { children } = props
  const [state, setState] = useReducer(reducer, initialState)

  useEffect(function fetchChapterData() {
      async function fetchData() {
        const { data: currentChapter } = await fetchChapterFromSupabase(state.currentChapterId)
        setState({ currentChapter })
        
        // One of these exists
        const nextChapterId = currentChapter?.decisions?.[0]?.go_to_chapter_id ?? currentChapter?.next_chapter_id
        const { data: nextChapter } = await fetchChapterFromSupabase(nextChapterId as number)

        setState({ nextChapter })
      }

    fetchData()
  }, [state.currentChapterId])

  function setCurrentChapterId (id: number) {
    setState({ currentChapterId: id })
  }

  const contextValue = {
    ...state,
    setCurrentChapterId
  }

  return (
    <ChapterContext.Provider value={contextValue}>
      {children}
    </ChapterContext.Provider>
  )
}

export const useChapterContext = () => useContext(ChapterContext)

function reducer (state: ChapterContextType, next: Partial<ChapterContextType>) {
  return { ...state, ...next }
}

function fetchChapterFromSupabase (chapterId: number): PostgrestBuilder<Database['public']['Tables']['chapters']['Row'] & { decisions: Database['public']['Tables']['decisions']['Row'][] }> {
  return supabase.from('chapters')
    .select(`
      text,
      image,
      next_chapter_id,
      is_last,
      decisions!decisions_chapter_id_fkey(
        id,
        go_to_chapter_id
      )
    `)
    .eq('id', chapterId)
    .or('used.eq.false,is_default.eq.true', { foreignTable: 'decisions' })
    .order('is_default', { foreignTable: 'decisions', ascending: true })
    .returns<Partial<ChapterContextType>>()
    .limit(1, { foreignTable: 'decisions' })
    .single()
}