import { z } from 'zod';

export namespace Fightcade {
  const ResponseSchema = z.object({res: z.literal('OK')});

  const RankSchema = z.nativeEnum({Unranked: 0, E: 1, D: 2, C: 3, B: 4, A: 5, S: 6} as const);

  export type Rank = z.infer<typeof RankSchema>;

  const GameInfoSchema = z.record(z.object({
    rank: z.optional(z.nullable(RankSchema)),
    num_matches: z.optional(z.number()),
    last_match: z.optional(z.number()),
    time_played: z.number(),
  }));

  /**
   * Fightcade GameInfo
   *
   * @param gameid - Object Keys are Fightcade Game ROM Name
   * @param rank - Fightcade Game Rank
   * @param num_matches - Amount of Ranked Games Played
   * @param last_match - Last Match Played Millisecond Epoch Date Timestamp
   * @param time_played - Time Played in Milliseconds.
   * @example
   * ```ts
   * // Print the user 'biggs' amount of ranked matches per game.
   * const username = 'biggs';
   * const user = await Fightcade.GetUser(username);
   * for (const gameid in user.gameinfo) {
   *   if (user.gameinfo[gameid].rank) {
   *    console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
   * }}
   * ```
   */
  export type GameInfo = {
    [gameid: string]: {
      rank?: Rank | null,
      num_matches?: number,
      last_match?: number,
      time_played: number
    }
  };

  const UserSchema = z.object({
    name: z.string(),
    gravatar: z.optional(z.string()),
    ranked: z.boolean(),
    last_online: z.optional(z.number()),
    date: z.number(),
    gameinfo: z.optional(GameInfoSchema),
  });

  /**
   * Fightcade User
   *
   * @param name - Fightcade Username
   * @param gravatar - Gravatar URL
   * @param ranked - Ranked Player?
   * @param last_online - Last Logout Millisecond Epoch Date Timestamp
   * @param date - Account Creation Millisecond Epoch Date Timestamp
   * @param gameinfo - Fightcade GameInfo
   * @example
   * ```ts
   * // Print the user 'biggs' account creation date.
   * const username = 'biggs';
   * const user = await Fightcade.GetUser(username);
   * const date = new Date(user.date);
   * console.log(date.toString());
   * ```
   */
  export type User = z.infer<typeof UserSchema>;

  const UserResponseSchema = ResponseSchema.merge(z.object({user: UserSchema}));

  const CountrySchema = z.object({
    iso_code: z.string(),
    full_name: z.string(),
  });
  /**
   * Fightcade Country
   *
   * @param iso_code - `ISO 3166-1 alpha2` Country Code
   * @param full_name - Country Name
   * @example
   * ```ts
   * // Print the player names and countries from replay '1638725293444-1085'.
   * const quarkid = '1638725293444-1085';
   * const replay = await Fightcade.GetReplay(quarkid);
   * replay.players.forEach(player => {
   *  if (typeof player.country === 'string') console.log(`${player.name}: ${player.country}`);
   *  else console.log(`${player.name}: ${player.country.full_name}`);
   * });
   * ```
   */
  export type Country = z.infer<typeof CountrySchema>;

  const PlayerSchema = z.object({
    name: z.string(),
    country: CountrySchema.or(z.string()),
    rank: z.optional(z.nullable(RankSchema)),
    score: z.optional(z.nullable(z.number())),
    gameinfo: z.optional(GameInfoSchema),
  });
  /**
   * Fightcade Player
   *
   * @param name - Fightcade Username
   * @param country - Country Name or Fightcade Country Object
   * @param rank - User Game Rank
   * @param score - Match Score
   * @param gameinfo - GameInfo Object
   *
   * @example
   * ```ts
   * // Print the player names from replay '1638725293444-1085'.
   * const quarkid = '1638725293444-1085'
   * const replay = await Fightcade.GetReplay(quarkid);
   * replay.players.forEach(player => {
   *  console.log(player.name);
   * });
   * ```
   */
  export type Player = z.infer<typeof PlayerSchema>;

  const PlayerResultsSchema = z.object({
    results: PlayerSchema.array(),
    count: z.number(),
  });

  const PlayerResultsResponseSchema = ResponseSchema.merge(z.object({results: PlayerResultsSchema}));

  const ReplaySchema = z.object({
    quarkid: z.string(),
    channelname: z.string(),
    date: z.number(),
    duration: z.number(),
    emulator: z.string(),
    gameid: z.string(),
    num_matches: z.number(),
    players: PlayerSchema.array(),
    ranked: z.number(),
    replay_file: z.optional(z.string()),
    realtime_views: z.optional(z.number()),
    saved_views: z.optional(z.number()),
  });

  /**
   * Fightcade Replay
   *
   * @param quarkid - Fightcade Challenge ID
   * @param channelname - Fightcade Game Channel Name
   * @param date - Replay Millisecond Epoch Date Timestamp
   * @param duration - Replay Duration in Seconds
   * @param emulator - Emulator Name
   * @param gameid - Fightcade ROM Name
   * @param num_matches - Replay Match Amount
   * @param players - Replay Player List
   * @param ranked - Ranked Match?
   * @param replay_file - Replay Filename
   * @param realtime_views - Total Amount of Live Spectators
   * @param saved_views - Amount of Replay Views
   *
   * @example
   * ```ts
   * // Print the date of replay '1638725293444-1085'.
   * const quarkid = '1638725293444-1085';
   * const replay = await Fightcade.GetReplay(quarkid);
   * const date = new Date(replay.date);
   * console.log(date.toString());
   * ```
   */
  export type Replay = z.infer<typeof ReplaySchema>;

  const ReplayResultsSchema = z.object({
    results: ReplaySchema.array(),
    count: z.number(),
  });
  const ReplayResultsResponseSchema = ResponseSchema.merge(z.object({results: ReplayResultsSchema}));

  const VideoURLResponse = z.record(z.string());

  /**
   * FightcadeVids URLs
   *
   * @param quarkid - Object Keys are Fightcade Challenge IDs
   * @param quarkid - Object Values are FightcadeVids URLs
   *
   * @example
   * ```ts
   * // Print the FightcadeVids URLs of the provided Challenge IDs if there are any.
   * const quarkids = ['1638725293444-1085', '1631056456752-7358', '1650423155905-2091'];
   * const urls = await Fightcade.GetVideoURLs(quarkids);
   * for (const quarkid in urls) console.log(urls[quarkid]);
   * ```
   */
  export type VideoURLs = {
    [quarkid: string]: string;
  };

  const GameSchema = z.object({
    gameid: z.string(),
    romof: z.optional(z.string()),
    name: z.string(),
    year: z.string(),
    publisher: z.string(),
    emulator: z.string(),
    available_for: z.number(),
    system: z.string(),
    ranked: z.boolean(),
    training: z.boolean(),
    genres: z.string().array(),
  });

  /**
   * Fightcade Game
   *
   * @param gameid - Fightcade Game ROM Name
   * @param romof - ???
   * @param name - Fightcade Game Channel Name
   * @param year - String Representation of Game's Release Year
   * @param publisher - Game Publisher
   * @param emulator - Game Emulator
   * @param available_for - ???
   * @param system - Fightcade System Name
   * @param ranked - Ranked Matchmaking Available?
   * @param training - Training Mode Available?
   * @param genres - Game Genre Tag List
   *
   * @example
   * ```ts
   * // Prints the publisher of the game.
   * const gameid = 'umk3';
   * const game = await Fightcade.GetGame(gameid);
   * console.log(game.publisher);
   * ```
   */
  export type Game = z.infer<typeof GameSchema>;

  const GameResponseSchema = ResponseSchema.merge(z.object({game: GameSchema}));

  const EventSchema = z.object({
    name: z.string(),
    author: z.string(),
    date: z.number(),
    gameid: z.string(),
    link: z.string(),
    region: z.string(),
    stream: z.optional(z.string()),
  });

  /**
   * Fightcade Event
   *
   * @param name - Event Name
   * @param author - Event Author's Fightcade Username
   * @param date - Event Millisecond Epoch Date Timestamp
   * @param gameid - Fightcade Game ROM Name
   * @param link - Event URL
   * @param region - Event Region
   * @param stream - Event Livestream URL
   * @example
   * ```ts
   * // Print the 15 most recent active event names for 'garou'.
   * const gameid = 'garou';
   * const events = await Fightcade.GetEvents(gameid);
   * events.forEach(event => console.log(event.name));
   * ```
   */
  export type Event = z.infer<typeof EventSchema>;

  const EventResultsSchema = z.object({
    results: EventSchema.array(),
    count: z.number(),
  });

  const EventResultsResponseSchema = ResponseSchema.merge(z.object({results: EventResultsSchema}));

  const URL = {
    API: 'https://www.fightcade.com/api/',
    REPLAY: 'https://replay.fightcade.com/',
    VIDS: 'https://fightcadevids.com/api/videolinks',
  } as const;

  /**
   * Fightcade Rank
   *
   * @example
   * ```ts
   * // Print the top 15 ranked UMK3 players and their ranks
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export const Rank = ['Unranked', 'E', 'D', 'C', 'B', 'A', 'S'] as const;

  /**
   * Get Fightcade User Info by Username
   *
   * @param username - Fightcade Username
   * @example
   * ```ts
   * // Print the amount of ranked matches per game for the user 'biggs'
   * const username = 'biggs';
   * const user = await Fightcade.GetUser(username);
   * for (const gameid in user.gameinfo) {
   *   if (user.gameinfo[gameid].rank) {
   *     console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
   * }}
   * ```
   */
  export async function GetUser(username: string): Promise<User> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'getuser', username}),
    });
    return UserResponseSchema.parse(await response.json()).user;
  }

  /**
   * Get Fightcade Replay by Challenge ID
   *
   * @param quarkid - Fightcade Challenge ID
   * @exmaple
   * ```ts
   * // Print the date of the replay '1638725293444-1085'
   * const quarkid = '1638725293444-1085';
   * const replay = await Fightcade.GetReplay(quarkid);
   * const date = new Date(replay.date);
   * console.log(date.toString());
   * ```
   */
  export async function GetReplay(quarkid: string): Promise<Replay> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchquarks', quarkid}),
    });
    return ReplaySchema.parse(ReplayResultsResponseSchema.parse(await response.json()).results.results.at(0));
  }

  /**
   * Get Newest Fightcade Replays
   *
   * @example
   * ```ts
   * // Print the game channel names of the 15 most recent replays.
   * const replays = await Fightcade.GetReplays();
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(): Promise<Replay[]>;
  /**
   * Get Newest Fightcade Replays
   *
   * @param limit - `default: 15` Amount of Replays to request beginning from `0`
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent replays.
   * const replays = await Fightcade.GetReplays(30);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(limit: number): Promise<Replay[]>;
  /**
   * Get Newest Fightcade Replays
   *
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent replays.
   * const replays = await Fightcade.GetReplays(30, 0);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(limit: number, offset: number): Promise<Replay[]>;
  /**
   * Get Newest Fightcade Replays
   *
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param best - `default: false` Sort Replays by Fightcade Player Elo
   * @example
   * ```ts
   * // Print the game channel names of the 5 most recent best replays.
   * const replays = await Fightcade.GetReplays(5, 0, true);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(limit: number, offset: number, best: boolean): Promise<Replay[]>;
  /**
   * Get Newest Fightcade Replays
   *
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param best - `default: false` Sort Replays by Fightcade Player Elo
   * @param since - `default: 0` Millisecond Epoch Timestamp Date
   * @example
   * ```ts
   * // Print the game channel names of the 5 most recent best replays since '2022-07-17T04:30:10.798Z'.
   * const date = new Date('2022-07-17T04:30:10.798Z');
   * const replays = await Fightcade.GetReplays(5, 0, true, date.getTime());
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>;
  export async function GetReplays(limit = 15, offset = 0, best = false, since = 0): Promise<Replay[]> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchquarks', limit, offset, best, since}),
    });
    return ReplayResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @example
   * ```ts
   * // Print the game channel names of the 15 most recent replays belonging to the user 'biggs'.
   * const username = 'biggs';
   * const replays = await Fightcade.GetUserReplays(username);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string): Promise<Replay[]>;
  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @param limit - `default: 15` Amount of Replays to request beginning from `0`
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent replays belonging to the user 'biggs'.
   * const username = 'biggs';
   * const replays = await Fightcade.GetUserReplays(username, 30);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string, limit: number): Promise<Replay[]>;
  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent replays belonging to the user 'biggs'.
   * const username = 'biggs';
   * const replays = await Fightcade.GetUserReplays(username, 30, 0);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string, limit: number, offset: number): Promise<Replay[]>;
  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param best - `default: false` Sort Replays by Fightcade Player Elo
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent best replays belonging to the user 'biggs'.
   * const username = 'biggs';
   * const replays = await Fightcade.GetUserReplays(username, 30, 0, true);
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean): Promise<Replay[]>;
  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param best - `default: false` Sort Replays by Fightcade Player Elo
   * @param since - `default: 0` Millisecond Epoch Timestamp Date
   * @example
   * ```ts
   * // Print the game channel names of the 30 most recent best replays belonging to the user 'biggs' since '2022-07-17T04:30:10.798Z'.
   * const username = 'biggs';
   * const date = new Date('2022-07-17T04:30:10.798Z');
   * const replays = await Fightcade.GetUserReplays(username, 30, 0, true, date.getTime());
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>;
  export async function GetUserReplays(username: string, limit = 15, offset = 0, best = false, since = 0): Promise<Replay[]> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchquarks', username, limit, offset, best, since}),
    });
    return ReplayResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade Replay URL
   *
   * @example
   * ```ts
   * // Print the replay URLs of the 15 most recent replays belonging to the user 'biggs'.
   * const username = 'biggs';
   * const user_replays = await Fightcade.GetUserReplays(username);
   * user_replays.forEach(replay => console.log(Fightcade.GetReplayURL(replay)));
   * ```
   */
  export const GetReplayURL = (replay: Replay) => `${URL.REPLAY}${replay.emulator}/${replay.gameid}/${replay.quarkid}`;

  /**
   * Get FightcadeVids URL of Fightcade Replay if it exists
   *
   * @param replay Fightcade Challenge ID
   * @example
   * ```ts
   * // Print the Replay's FightcadeVids URL.
   * const quarkid = '1638725293444-1085';
   * const replay = await Fightcade.GetReplay(quarkid);
   * const url = await Fightcade.GetVideoURL(replay);
   * console.log(url ?? 'Replay not found.');
   * ```
   */
  export async function GetVideoURL(replay: string): Promise<string>;
  /**
   * Get FightcadeVids URL of Fightcade Replay if it exists
   *
   * @param replay Fightcade Replay Object
   * @example
   * ```ts
   * // Print the FightcadeVids URL by Challenge ID.
   * const quarkid = '1638725293444-1085';
   * const url = await Fightcade.GetVideoURL(quarkid);
   * console.log(url ?? 'Replay not found.');
   * ```
   */
  export async function GetVideoURL(replay: Replay): Promise<string>;
  export async function GetVideoURL(replay: string | Replay): Promise<string> {
    const response = await fetch(URL.VIDS, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ids: [(typeof replay === 'string') ? replay : replay.quarkid]}),
    });
    const url = VideoURLResponse.parse(await response.json())[(typeof replay === 'string') ? replay : replay.quarkid];
    if (url) return url;
    throw Error(`Property '${(typeof replay === 'string') ? replay : replay.quarkid}' does not exist on type 'Fightcade.VideoURLs'`);
  }

  /**
   * Get a list of FightcadeVids URLs from a list of Fightcade Replays if they exist
   *
   * @param replays Fightcade Challenge IDs
   * @returns Empty if there are no valid URLs
   * @example
   * ```ts
   * // Print the FightcadeVids URLs of the provided Challenge IDs if there are any.
   * const quarkids = ['1638725293444-1085', '1631056456752-7358', '1650423155905-2091'];
   * const urls = await Fightcade.GetVideoURLs(quarkids);
   * for (const uid in urls) console.log(urls[uid]);
   * ```
   */
  export async function GetVideoURLs(replays: string[]): Promise<VideoURLs>;
  /**
   * Get a list of FightcadeVids URLs from a list of Fightcade Replays if they exist
   *
   * @param replays Fightcade Replay Objects
   * @returns Empty if there are no valid URLs
   * @example
   * ```ts
   * // Print the replay's FightcadeVids URLs if there are any.
   * const replays = await Fightcade.GetReplays();
   * const urls = await Fightcade.GetVideoURLs(replays);
   * for (const uid in urls) console.log(urls[uid]);
   * ```
   */
  export async function GetVideoURLs(replays: Replay[]): Promise<VideoURLs>;
  export async function GetVideoURLs(replays: string[] | Replay[]): Promise<VideoURLs> {
    const response = await fetch(URL.VIDS, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ids: replays.map(replay => (typeof replay === 'string') ? replay : replay.quarkid)}),
    });
    return VideoURLResponse.parse(await response.json());
  }

  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @example
   * ```ts
   * // Print the top 15 recent ranked UMK3 players and their ranks.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string): Promise<Player[]>;
  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `0`
   * @example
   * ```ts
   * // Print the top 30 recent ranked UMK3 players and their ranks.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid, 30);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string, limit: number): Promise<Player[]>;
  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @example
   * ```ts
   * // Print the top 30 recent ranked UMK3 players and their ranks.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid, 30, 0);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string, limit: number, offset: number): Promise<Player[]>;
  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param byElo - `default: true` Sort Players by Fightcade Elo
   * @example
   * ```ts
   * // Print the top 30 recent ranked UMK3 players and their ranks without ordering.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid, 30, 0, false);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string, limit: number, offset: number, byElo: boolean): Promise<Player[]>;
  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @param byElo - `default: true` Sort Players by Fightcade Elo
   * @param recent - `default: true` Only Include Recent Players
   * @example
   * ```ts
   * // Print the top 30 ranked UMK3 players of all time and their ranks without ordering.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid, 30, 0, false, false);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string, limit: number, offset: number, byElo: boolean, recent: boolean): Promise<Player[]>;
  export async function GetRankings(gameid: string, limit = 15, offset = 0, byElo = true, recent = true): Promise<Player[]> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchrankings', gameid, limit, offset, byElo, recent}),
    });
    return PlayerResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade Game Info
   *
   * @param gameid - Fightcade ROM Name
   * @example
   * ```ts
   * // Prints the publisher of the game.
   * const gameid = 'umk3';
   * const game = await Fightcade.GetGame(gameid);
   * console.log(game.publisher);
   * ```
   */
  export async function GetGame(gameid: string): Promise<Game> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'gameinfo', gameid}),
    });
    return GameResponseSchema.parse(await response.json()).game;
  }

  /**
   * Get Fightcade Game's Active Events
   *
   * @param gameid - Fightcade ROM Name
   * @returns Empty if there are no active Events
   * @example
   * ```ts
   * // Print the 15 most recent active events for a game.
   * const gameid = 'garou';
   * const events = await Fightcade.GetEvents(gameid);
   * events.forEach(event => console.log(event));
   * ```
   */
  export async function GetEvents(gameid: string): Promise<Event[]>;
  /**
   * Get Fightcade Game's Active Events
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `0`
   * @returns Empty if there are no active Events
   * @example
   * ```ts
   * // Print the 30 most recent active events for a game.
   * const gameid = 'garou';
   * const events = await Fightcade.GetEvents(gameid, 30);
   * events.forEach(event => console.log(event));
   * ```
   */
  export async function GetEvents(gameid: string, limit: number): Promise<Event[]>;
  /**
   * Get Fightcade Game's Active Events
   *
   * @param gameid - Fightcade ROM Name
   * @param limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param offset - `default: 0` Newest Replay number to request
   * @returns Empty if there are no active Events
   * @example
   * ```ts
   * // Print the 30 most recent active events for a game.
   * const gameid = 'garou';
   * const events = await Fightcade.GetEvents(gameid, 30, 0);
   * events.forEach(event => console.log(event));
   * ```
   */
  export async function GetEvents(gameid: string, limit: number, offset: number): Promise<Event[]>;
  export async function GetEvents(gameid: string, limit = 15, offset = 0): Promise<Event[]> {
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchevents', gameid, limit, offset}),
    });
    return EventResultsResponseSchema.parse(await response.json()).results.results;
  }
};

export default {
  Rank: Fightcade.Rank,
  GetUser: Fightcade.GetUser,
  GetReplay: Fightcade.GetReplay,
  GetReplays: Fightcade.GetReplays,
  GetUserReplays: Fightcade.GetUserReplays,
  GetReplayURL: Fightcade.GetReplayURL,
  GetVideoURL: Fightcade.GetVideoURL,
  GetVideoURLs: Fightcade.GetVideoURLs,
  GetRankings: Fightcade.GetRankings,
  GetGame: Fightcade.GetGame,
  GetEvents: Fightcade.GetEvents,
} as const;
