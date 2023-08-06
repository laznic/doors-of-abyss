import React from "react";
import { Button } from '@/components/ui/button'
import { useChapterContext } from "./modules/chapters/context/ChapterContext";

function App() {
  const { currentChapter, goToNextChapter } = useChapterContext()

  return (
      <div className="App">
        {currentChapter?.text}
        <Button onClick={goToNextChapter}>Next</Button>
      </div>
  )
}

export default App;
