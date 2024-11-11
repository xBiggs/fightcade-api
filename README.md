# fightcade-api
An unofficial TypeScript wrapper for the [Fightcade](https://www.fightcade.com/) Public API.

## Installation

```sh-session
bun add fightcade-api
```

```sh-session
pnpm install fightcade-api
```

```sh-session
npm install fightcade-api
```

```sh-session
yarn add fightcade-api
```

## Example usage

There are several examples provided in the source's TSDoc.

This library supports TS, ESM, and CommonJS.

#### ECMAScript Modules

```js
import { Fightcade } from 'fightcade-api';
```

You can also import library functions individually:

```js
import { GetUser } from 'fightcade-api';
```

#### CommonJS

```js
const Fightcade = require('fightcade-api');
```

### GetUser

```ts
async function GetUser(username: string): Promise<Fightcade.User>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the amount of ranked matches per game for the user 'biggs'.
  const user = await Fightcade.GetUser('biggs');
  Object.entries(user.gameinfo).forEach(([gameid, gameinfo]) => {
    if (gameinfo.rank) console.log(`${gameid}: ${gameinfo.num_matches}`);
  });
} catch(e) {
  console.error(e);
}
```

### GetReplay

```ts
async function GetReplay(quarkid: string): Promise<Fightcade.Replay>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the date of the replay '1638725293444-1085'
  const replay = await Fightcade.GetReplay('1638725293444-1085');
  const date = new Date(replay.date);
  console.log(date.toString());
} catch(e) {
  console.error(e);
}
```

### GetReplays

```ts
async function GetReplays(): Promise<Fightcade.Replay[]>;
async function GetReplays(args: {gameid?: string, limit?: number, offset?: number, best?: boolean, since?: number, ranked?: boolean}): Promise<Fightcade.Replay[]>;
async function GetReplays(args = {}): Promise<Fightcade.Replay[]>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the game channel names of the 15 most recent replays.
  const replays = await Fightcade.GetReplays();
  replays.forEach(replay => console.log(replay.channelname));
} catch(e) {
  console.error(e);
}
```

### GetUserReplays

```ts
async function GetUserReplays(username: string): Promise<Fightcade.Replay[]>;
async function GetUserReplays(username: string, args: {limit?: number, offset?: number, best?: boolean, since?: number, ranked: boolean}): Promise<Fightcade.Replay[]>;
async function GetUserReplays(username: string, args = {}): Promise<Fightcade.Replay[]>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the game channel names of the 15 most recent replays belonging to the user 'biggs'.
  const replays = await Fightcade.GetUserReplays('biggs');
  replays.forEach(replay => console.log(replay.channelname));
} catch(e) {
  console.error(e);
}
```

### GetReplayURL

```ts
function GetReplayURL(replay: Fightcade.Replay): string;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the replay URLs of the 15 most recent replays belonging to the user 'biggs'.
  const user_replays = await Fightcade.GetUserReplays('biggs');
  user_replays.forEach(replay => console.log(Fightcade.GetReplayURL(replay)));
} catch(e) {
  console.error(e);
}
```

### GetRankings

```ts
async function GetRankings(gameid: string): Promise<Fightcade.Player[]>;
async function GetRankings(gameid: string, args: {limit?: number, offset?: number, byElo?: boolean, recent?: boolean}): Promise<Fightcade.Player[]>;
async function GetRankings(gameid: string, args = {}): Promise<Fightcade.Player[]>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the top 15 recent ranked UMK3 players and their ranks.
  const gameid = 'umk3';
  const rankings = await Fightcade.GetRankings(gameid);
  rankings.forEach(player => {
    if (player.gameinfo && player.gameinfo[gameid].rank) {
      console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
    }
  });
} catch(e) {
  console.log(e);
}
```

### GetGame

```ts
async function GetGame(gameid: string): Promise<Fightcade.Game>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Prints the publisher of the game 'umk3'.
  const game = await Fightcade.GetGame('umk3');
  console.log(game.publisher);
} catch(e) {
  console.log(e);
}
```

### GetEvents

```ts
async function GetEvents(args: {gameid?: string, limit?: number, offset?: number} = {}): Promise<Fightcade.Event[]>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the 15 most recent active events for all games.
  const events = await Fightcade.GetEvents();
  events.forEach(event => console.log(event));
} catch(e) {
  console.log(e);
}
```

## Deprecated Functions

`GetVideoURL()` and `GetVideoURLs()` have been deprecated because `https://fightcadevids.com` is currently abandoned.

### GetVideoURL

```ts
async function GetVideoURL(replay: string): Promise<string>;
async function GetVideoURL(replay: Fightcade.Replay): Promise<string>;
async function GetVideoURL(replay: string | Fightcade.Replay): Promise<string>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the Replay's FightcadeVids URL.
  const replay = await Fightcade.GetReplay('1638725293444-1085');
  const url = await Fightcade.GetVideoURL(replay);
  console.log(url ?? 'Replay not found.');
} catch(e) {
  console.error(e);
}
```

### GetVideoURLs

```ts
async function GetVideoURLs(replays: string[]): Promise<Fightcade.VideoURLs>;
async function GetVideoURLs(replays: Replay[]): Promise<Fightcade.VideoURLs>;
async function GetVideoURLs(replays: string[] | Replay[]): Promise<Fightcade.VideoURLs>;
```

```js
import { Fightcade } from 'fightcade-api';

try {
  // Print the replay's FightcadeVids URLs if there are any.
  const replays = await Fightcade.GetReplays();
  const urls = await Fightcade.GetVideoURLs(replays);
  Object.values(urls).forEach(url => console.log(url));
} catch(e) {
  console.error(e);
}
```

## Links

- [Fightcade](https://www.fightcade.com/)
- [Bun](https://bun.sh/)
- [npm](https://www.npmjs.com/package/fightcade-api)
- [NodeJS](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [zod](https://zod.dev/)
- [tsup](https://tsup.egoist.dev/)
- [TSDoc](https://tsdoc.org/)
