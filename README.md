
![Doors of Abyss: The Endless Chase](https://github.com/laznic/doors-of-abyss/blob/main/public/share-image.png)

## An interactive, narrative browser game

Doors of Abyss: The Endless Chase is an interactive browser game. It has an original story which went through the AI to improve the language used (because it was an amateur hour when we wrote it ourselves). Images have been generated via AI (Midjourney and Stable Diffusion)

It takes about 15-30min to complete the game, and some of the actions you do in the game **will affect other players in the next playthrough.**

https://doorsofabyss.com

> **Note**
>
> This project is optimized for desktop devices

Built with
- [Supabase](https://supabase.com)
- [React](https://reactjs.org/)
- [Frame Motion](https://www.framer.com/motion)
- [Midjourney](https://www.midjourney.com/home)
- [Stable Diffusion](https://stability.ai/stable-diffusion)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI](https://openai.com/)

## How it works

The steps are simple:
1. Start the game
2. Recommended: use keyboard (Enter & arrow keys) to navigate through the story
3. Enjoy the story and imagery
4. Make choices along the way that affect other players

It's mainly all about fetching chapter data, and then showing correct elements according to it.
It fetches the current and next chapters at once to improve the experience so that you don't need to wait too long when continuing the story.

List of Supabase features used:
- Database
  - storing chapters, actions, options, user decisions, etc.
- Functions
  - since some actions affect other players, it made sense to edge functions to handle some extra logic
- Storage
  - storing the chapter images, and player notes

## Motivation

Both of us are big fans of games, especially story heavy ones (big fans of Baldur's Gate series). So it made sense to do something like this.

We also wanted to make something that can be played over and over again, as the story changes a bit based on what you choose. 


## Ideas for the future

- Display average completion time based on actual data
- Add some triggers to divert the story from the static paths 
  - e.g. 50/50 chance to trigger a different dialogue options
- More sound effects to make it more immersive
- AI generated dialogue options? 

## The team / contributors
- Niklas Lepistö ([GitHub](https://github.com/laznic), [Twitter](https://twitter.com/laznic))
- Jani Reijonen ([Twitter](https://twitter.com/janireijonen))

## Credits
- Amazing music by [Giole Fazzer](https://pixabay.com/users/gioelefazzer)
- Exhaling sound also from [Pixabay](https://pixabay.com)

  <sup>Made for Supabase Launch Week 8 Hackathon.</sup> 

<details>
  <summary>
    <sup><sup>
    Spoiler warning
    </sup></sup>
  </summary>
  
 <sup><sup>Also, if you didn't notice while playing: the story is made to loop, resulting in the "The Endless Chase."</sup></sup>
</details>
