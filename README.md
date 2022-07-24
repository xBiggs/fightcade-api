# fightcade-api
An unofficial ts-node wrapper for the Fightcade API.

## Installation

**Node.js 18.6.0 or newer is required.**

```sh-session
npm install fightcade-api
```

## Example usage

There a several examples provided in the source's TSDoc.


```ts
import * as Fightcade from 'fightcade-api';

const main = async () => {

  // Print the top 15 ranked UMK3 players and their ranks.
  const gameid = 'umk3';
  const rankings = await Fightcade.GetRankings(gameid);
  rankings.forEach(player => {
    if (player.gameinfo && player.gameinfo[gameid].rank)
      console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
  });
  
 // Print the user 'biggs' amount of ranked matches per game.
 const user = await Fightcade.GetUser('biggs');
 for (const gameid in user.gameinfo)
   if (user.gameinfo[gameid].rank)
      console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
      
  // Print the player names from replay '1638725293444-1085'.
  const replay = await Fightcade.GetReplay('1638725293444-1085');
  replay.players.forEach(player => {
    console.log(player.name);
  });

}

main();
```

## Links

- [npm](https://www.npmjs.com/package/fightcade-api)
- [nodejs](https://nodejs.org/en/)
- [typescript](https://www.typescriptlang.org/)
- [tsdoc](https://tsdoc.org/)
- [fightcade](https://www.fightcade.com/)

