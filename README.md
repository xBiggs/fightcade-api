# fightcade-api
An unofficial ts-node wrapper for the Fightcade API.

## Installation

**Node.js 18.6.0 or newer is required.**

```sh-session
npm install fightcade-api
```

## Example usage

There are several examples provided in the source's TSDoc.

### GetUser

```ts
async function GetUser(username: string): Promise<User>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the amount of ranked matches per game for the user 'biggs'.
    const user = await Fightcade.GetUser('biggs');
    for (const gameid in user.gameinfo) {
      if (user.gameinfo[gameid].rank) {
        console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
      }
    }
  } catch(e) {
    console.log(e);
  }
})();

```

### GetReplay

```ts
async function GetReplay(quarkid: string): Promise<Replay>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the date of the replay '1638725293444-1085'
    const replay = await Fightcade.GetReplay('1638725293444-1085');
    const date = new Date(replay.date);
    console.log(date.toString());
  } catch(e) {
    console.log(e);
  }
})();

```

### GetReplays

```ts
async function GetReplays(): Promise<Replay[]>
async function GetReplays(limit: number, offset: number): Promise<Replay[]>
async function GetReplays(limit: number, offset: number, best: boolean): Promise<Replay[]>
async function GetReplays(limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the game channel names of the 15 most recent replays.
    const replays = await Fightcade.GetReplays();
    replays.forEach(replay => console.log(replay.channelname));
  } catch(e) {
    console.log(e);
  }
})();

```

### GetUserReplays

```ts
async function GetUserReplays(username: string): Promise<Replay[]>
async function GetUserReplays(username: string, limit: number, offset: number): Promise<Replay[]>
async function GetUserReplays(username: string, limit: number, offset: number, best: boolean): Promise<Replay[]>
async function GetUserReplays(username: string, limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the game channel names of the 15 most recent replays belonging to the user 'biggs'.
    const replays = await Fightcade.GetUserReplays('biggs');
    replays.forEach(replay => console.log(replay.channelname));
  } catch(e) {
    console.log(e);
  }
})();
```

### GetReplayURL

```ts
function GetReplayURL(replay: Replay): string
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the replay URLs of the 15 most recent replays belonging to the user 'biggs'.
    const user_replays = await Fightcade.GetUserReplays('biggs');
    user_replays.forEach(replay => console.log(Fightcade.GetReplayURL(replay)));
  } catch(e) {
    console.log(e);
  }
})();
```

### GetVideoURL

```ts
async function GetVideoURL(replay: Replay): Promise<string>
async function GetVideoURL(replay: string): Promise<string>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the replay's FightcadeVids URL.
    const quarkid = '1638725293444-1085';
    const replay = await Fightcade.GetReplay(quarkid);
    const url = await Fightcade.GetVideoURL(replay);
    console.log(url);
  } catch(e) {
    console.log(e);
  }
})();
```

### GetVideoURLs

```ts
async function GetVideoURLs(replays: Replay[]): Promise<FightcadeVids.Response>
async function GetVideoURLs(replays: string[]): Promise<FightcadeVids.Response>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the replay's FightcadeVids URLs if there are any.
    const replays = await Fightcade.GetReplays();
    const urls = await Fightcade.GetVideoURLs(replays);
    for (const uid in urls) console.log(urls[uid]);
  } catch(e) {
    console.log(e);
  }
})();
```

### GetRankings

```ts
async function GetRankings(gameid: string, byElo: boolean = true, recent: boolean = true): Promise<Player[]>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Print the top 15 ranked UMK3 players and their ranks.
    const gameid = 'umk3';
    const rankings = await Fightcade.GetRankings(gameid);
    rankings.forEach(player => {
      if (player.gameinfo && player.gameinfo[gameid].rank)
      console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
    });
  } catch(e) {
    console.log(e);
  }
})();
```

### GetGame

```ts
async function GetGame(gameid: string): Promise<Game>
```

```ts
import * as Fightcade from 'fightcade-api';

const main = (async () => {
  try {
    // Prints the publisher of the game.
    const gameid = 'umk3';
    const game = await Fightcade.GetGame(gameid);
    console.log(game.publisher);
  } catch(e) {
    console.log(e);
  }
})();
```

### GetEvents

**This method has not been implemented yet.**

```ts
async function GetEvents(gameid: string, limit: number, offset: number): Promise<Event[]>
```

## Links

- [npm](https://www.npmjs.com/package/fightcade-api)
- [nodejs](https://nodejs.org/en/)
- [typescript](https://www.typescriptlang.org/)
- [tsdoc](https://tsdoc.org/)
- [fightcade](https://www.fightcade.com/)

