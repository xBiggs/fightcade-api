import { z } from 'zod';

export namespace Fightcade {
  const ResponseSchema = z.object({res: z.literal('OK')});

  const RankEnumSchema = z.nativeEnum({Unranked: 0, E: 1, D: 2, C: 3, B: 4, A: 5, S: 6} as const);

  export type RankEnum = z.infer<typeof RankEnumSchema>;

  const GameInfoSchema = z.record(z.object({
    rank: z.optional(z.nullable(RankEnumSchema)),
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
   *
   * @example
   * ```js
   * // Print the amount of ranked matches per game for the user 'biggs'.
   * const user = await Fightcade.GetUser('biggs');
   * Object.entries(user.gameinfo).forEach(([gameid, gameinfo]) => {
   *   if (gameinfo.rank) console.log(`${gameid}: ${gameinfo.num_matches}`);
   * });
   * ```
   */
  export type GameInfo = {
    [gameid: string]: {
      rank?: RankEnum | null,
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
   *
   * @example
   * ```js
   * // Print the account creation date for the user 'biggs'.
   * const user = await Fightcade.GetUser('biggs');
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
   *
   * @example
   * ```js
   * // Print the player names and countries from the replay '1638725293444-1085'.
   * const replay = await Fightcade.GetReplay('1638725293444-1085');
   * replay.players.forEach(player => console.log(`${player.name}: ${(typeof player.country === 'string') ? player.country : player.country.full_name}`));
   * ```
   */
  export type Country = z.infer<typeof CountrySchema>;

  const PlayerSchema = z.object({
    name: z.string(),
    country: CountrySchema.or(z.string()),
    rank: z.optional(z.nullable(RankEnumSchema)),
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
   * ```js
   * // Print the player names from the replay '1638725293444-1085'.
   * const replay = await Fightcade.GetReplay('1638725293444-1085');
   * replay.players.forEach(player => console.log(player.name));
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
    num_matches: z.optional(z.number()),
    players: PlayerSchema.array(),
    ranked: z.nullable(z.number().or(z.literal('cancelled'))),
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
   * @param ranked - Ranked FT# Set or 'cancelled'
   * @param replay_file - Replay Filename
   * @param realtime_views - Total Amount of Live Spectators
   * @param saved_views - Amount of Replay Views
   *
   * @example
   * ```js
   * // Print the date of the replay '1638725293444-1085'.
   * const replay = await Fightcade.GetReplay('1638725293444-1085');
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
   * ```js
   * // Print the FightcadeVids URLs of the provided Challenge IDs if there are any.
   * const quarkids = ['1638725293444-1085', '1631056456752-7358', '1650423155905-2091'];
   * const urls = await Fightcade.GetVideoURLs(quarkids);
   * Object.values(urls).forEach(url => console.log(url));
   * ```
   */
  export type VideoURLs = {
    [quarkid: string]: string;
  };

  const GameSchema = z.object({
    gameid: z.string(),
    romof: z.optional(z.string()),
    name: z.string(),
    year: z.string().optional(),
    publisher: z.string().optional(),
    emulator: z.string(),
    available_for: z.number(),
    system: z.string(),
    ranked: z.boolean(),
    training: z.boolean().optional(),
    genres: z.string().array().optional(),
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
   * @param ranked - Ranked Matchmaking Available
   * @param training - Training Mode Available
   * @param genres - Game Genre Tag List
   *
   * @example
   * ```js
   * // Prints the publisher of the game 'umk3'.
   * const game = await Fightcade.GetGame('umk3');
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
   *
   * @example
   * ```js
   * // Print the 15 most recent active event names for 'garou'.
   * const events = await Fightcade.GetEvents('garou');
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
   * ```js
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
   *
   * @example
   * ```js
   * // Print the amount of ranked matches per game for the user 'biggs'.
   * const user = await Fightcade.GetUser('biggs');
   * Object.entries(user.gameinfo).forEach(([gameid, gameinfo]) => {
   *   if (gameinfo.rank) console.log(`${gameid}: ${gameinfo.num_matches}`);
   * });
   * ```
   */
  export async function GetUser(username: string): Promise<Fightcade.User> {
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
   *
   * @exmaple
   * ```js
   * // Print the date of the replay '1638725293444-1085'
   * const replay = await Fightcade.GetReplay('1638725293444-1085');
   * const date = new Date(replay.date);
   * console.log(date.toString());
   * ```
   */
  export async function GetReplay(quarkid: string): Promise<Fightcade.Replay> {
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
   * ```js
   * // Print the game channel names of the 15 most recent replays.
   * const replays = await Fightcade.GetReplays();
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(): Promise<Fightcade.Replay[]>;
  /**
   * Get Fightcade Replays
   *
   * @param args.gameid - `default: undefined` Fightcade ROM Name
   * @param args.limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param args.offset - `default: 0` Newest Replay number to request
   * @param args.best - `default: false` Sort Replays by Fightcade Player Elo
   * @param args.since - `default: 0` Millisecond Epoch Timestamp Date
   * @param args.ranked - `default: false` Request only Ranked Replays
   *
   * @example
   * ```js
   * // Print the game channel names of the 5 best most recent ranked replays since '2022-07-17T04:30:10.798Z'.
   * const date = new Date('2022-07-17T04:30:10.798Z');
   * const replays = await Fightcade.GetReplays({limit: 5, best: true, since: date.getTime(), ranked: true});
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetReplays(args: {gameid?: string, limit?: number, offset?: number, best?: boolean, since?: number, ranked?: boolean}): Promise<Fightcade.Replay[]>;
  export async function GetReplays(args = {}): Promise<Fightcade.Replay[]> {
    // gameid = undefined, limit = 15, offset = 0, best = false, since = 0, boolean = false
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchquarks', ...args}),
    });
    return ReplayResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   *
   * @example
   * ```js
   * // Print the game channel names of the 15 most recent replays belonging to the user 'biggs'.
   * const replays = await Fightcade.GetUserReplays('biggs');
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string): Promise<Fightcade.Replay[]>;
  /**
   * Get Fightcade User's Newest Replays
   *
   * @param username - Fightcade Username
   * @param args.limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param args.offset - `default: 0` Newest Replay number to request
   * @param args.best - `default: false` Sort Replays by Fightcade Player Elo
   * @param args.since - `default: 0` Millisecond Epoch Timestamp Date
   * @param args.ranked - `default: false` Request only Ranked Replays
   *
   * @example
   * ```js
   * // Print the game channel names of the 30 best most recent ranked replays for the user 'biggs' since '2022-07-17T04:30:10.798Z'.
   * const date = new Date('2022-07-17T04:30:10.798Z');
   * const replays = await Fightcade.GetUserReplays('biggs', {limit: 30, best: true, since: date.getTime(), ranked: true});
   * replays.forEach(replay => console.log(replay.channelname));
   * ```
   */
  export async function GetUserReplays(username: string, args: {limit?: number, offset?: number, best?: boolean, since?: number, ranked?: boolean}): Promise<Fightcade.Replay[]>;
  export async function GetUserReplays(username: string, args = {}): Promise<Fightcade.Replay[]> {
    // limit = 15, offset = 0, best = false, since = 0, ranked = false
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchquarks', username, ...args}),
    });
    return ReplayResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade Replay URL
   *
   * @example
   * ```js
   * // Print the replay URLs of the 15 most recent replays belonging to the user 'biggs'.
   * const user_replays = await Fightcade.GetUserReplays('biggs');
   * user_replays.forEach(replay => console.log(Fightcade.GetReplayURL(replay)));
   * ```
   */
  export const GetReplayURL = (replay: Fightcade.Replay) => `${URL.REPLAY}${replay.emulator}/${replay.gameid}/${replay.quarkid}`;

  /**
   * @deprecated `GetVideoURL()` is deprecated because `https://fightcadevids.com` is currently abandoned.
   *
   * Get FightcadeVids URL of Fightcade Replay if it exists
   *
   * @param replay Fightcade Challenge ID
   *
   * @example
   * ```js
   * // Print the Replay's FightcadeVids URL.
   * const replay = await Fightcade.GetReplay('1638725293444-1085');
   * const url = await Fightcade.GetVideoURL(replay);
   * console.log(url ?? 'Replay not found.');
   * ```
   */
  export async function GetVideoURL(replay: string): Promise<string>;
  /**
   * @deprecated `GetVideoURL()` is deprecated because `https://fightcadevids.com` is currently abandoned.
   *
   * Get FightcadeVids URL of Fightcade Replay if it exists
   *
   * @param replay Fightcade Replay Object
   *
   * @example
   * ```js
   * // Print the FightcadeVids URL by Challenge ID.
   * const url = await Fightcade.GetVideoURL('1638725293444-1085');
   * console.log(url ?? 'Replay not found.');
   * ```
   */
  export async function GetVideoURL(replay: Fightcade.Replay): Promise<string>;
  export async function GetVideoURL(replay: string | Fightcade.Replay): Promise<string> {
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
   * @deprecated `GetVideoURLs()` is deprecated because `https://fightcadevids.com` is currently abandoned.
   *
   * Get a list of FightcadeVids URLs from a list of Fightcade Replays if they exist
   *
   * @param replays Fightcade Challenge IDs
   * @returns Empty array if there are no valid URLs
   *
   * @example
   * ```js
   * // Print the FightcadeVids URLs of the provided Challenge IDs if there are any.
   * const quarkids = ['1638725293444-1085', '1631056456752-7358', '1650423155905-2091'];
   * const urls = await Fightcade.GetVideoURLs(quarkids);
   * Object.values(urls).forEach(url => console.log(url));
   * ```
   */
  export async function GetVideoURLs(replays: string[]): Promise<Fightcade.VideoURLs>;
  /**
   * @deprecated `GetVideoURLs()` is deprecated because `https://fightcadevids.com` is currently abandoned.
   *
   * Get a list of FightcadeVids URLs from a list of Fightcade Replays if they exist
   *
   * @param replays Fightcade Replay Objects
   * @returns Empty array if there are no valid URLs
   *
   * @example
   * ```js
   * // Print the replay's FightcadeVids URLs if there are any.
   * const replays = await Fightcade.GetReplays();
   * const urls = await Fightcade.GetVideoURLs(replays);
   * Object.values(urls).forEach(url => console.log(url));
   * ```
   */
  export async function GetVideoURLs(replays: Fightcade.Replay[]): Promise<Fightcade.VideoURLs>;
  export async function GetVideoURLs(replays: string[] | Fightcade.Replay[]): Promise<Fightcade.VideoURLs> {
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
   *
   * @example
   * ```js
   * // Print the top 15 recent ranked UMK3 players and their ranks.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid);
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string): Promise<Fightcade.Player[]>;
  /**
   * Get Fightcade Game's Top Ranked Players
   *
   * @param gameid - Fightcade ROM Name
   * @param args.limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param args.offset - `default: 0` Newest Replay number to request
   * @param args.byElo - `default: true` Sort Players by Fightcade Elo
   * @param args.recent - `default: true` Only Include Recent Players
   *
   * @example
   * ```js
   * // Print the top 30 ranked UMK3 players of all time and their ranks without ordering.
   * const gameid = 'umk3';
   * const rankings = await Fightcade.GetRankings(gameid, {limit: 30, offset: 0, byElo: false, recent: false});
   * rankings.forEach(player => {
   *  if (player.gameinfo && player.gameinfo[gameid].rank) {
   *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
   * }});
   * ```
   */
  export async function GetRankings(gameid: string, args: {limit?: number, offset?: number, byElo?: boolean, recent?: boolean}): Promise<Fightcade.Player[]>;
  export async function GetRankings(gameid: string, args = {}): Promise<Fightcade.Player[]> {
    // limit = 15, offset = 0, byElo = true, recent = true
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchrankings', gameid, ...args}),
    });
    return PlayerResultsResponseSchema.parse(await response.json()).results.results;
  }

  /**
   * Get Fightcade Game Info
   *
   * @param gameid - Fightcade ROM Name
   *
   * @example
   * ```js
   * // Prints the publisher of the game 'umk3'.
   * const game = await Fightcade.GetGame('umk3');
   * console.log(game.publisher);
   * ```
   */
  export async function GetGame(gameid: string): Promise<Fightcade.Game> {
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
   * @param args.gameid - `deafult: undefined` Fightcade ROM Name. Get all Events if no `gameid` is supplied
   * @param args.limit - `default: 15` Amount of Replays to request beginning from `offset`
   * @param args.offset - `default: 0` Newest Replay number to request
   *
   * @returns Empty array if there are no active Events
   *
   * @example
   * ```js
   * // Print the 30 most recent active events for a game.
   * const events = await Fightcade.GetEvents({gameid: 'garou', limit: 30, offset: 0});
   * events.forEach(event => console.log(event));
   * ```
   */
  export async function GetEvents(args: {gameid?: string, limit?: number, offset?: number} = {}): Promise<Fightcade.Event[]> {
    // gameid = undefined, limit = 15, offset = 0
    const response = await fetch(URL.API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({req: 'searchevents', ...args}),
    });
    return EventResultsResponseSchema.parse(await response.json()).results.results;
  }
};

export const Rank = Fightcade.Rank;
export const GetUser = Fightcade.GetUser;
export const GetReplay = Fightcade.GetReplay;
export const GetReplays = Fightcade.GetReplays;
export const GetUserReplays = Fightcade.GetUserReplays;
export const GetReplayURL = Fightcade.GetReplayURL;
export const GetVideoURL = Fightcade.GetVideoURL;
export const GetVideoURLs = Fightcade.GetVideoURLs;
export const GetRankings = Fightcade.GetRankings;
export const GetGame = Fightcade.GetGame;
export const GetEvents = Fightcade.GetEvents;
