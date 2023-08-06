import React from "react";
import { Button } from '@/components/ui/button'
import { ChapterContextProvider } from "./modules/chapters/context/ChapterContext";

function App() {
  return (
    <ChapterContextProvider>
      <div className="App">
        Hello
        <Button>Clicky</Button>
      </div>
    </ChapterContextProvider>
  )
}

export default App;
