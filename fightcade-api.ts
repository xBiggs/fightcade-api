namespace Fightcade {

  export enum URL {
    API = 'https://www.fightcade.com/api/',
    REPLAY = 'https://replay.fightcade.com/',
    VIDEO = 'https://fightcadevids.com/video/',
  }

  export enum Req {
    GET_USER = 'getuser',
    SEARCH_QUARKS = 'searchquarks',
    SEARCH_RANKINGS = 'searchrankings',
  }

  export enum Res {
    OK = 'OK',
  }

  export interface Request {
    req: Req,
  }

  export interface Response {
    res: Res,
  }

  export interface UserRequest extends Fightcade.Request {
    username: string,
  }

  export interface UserResponse extends Fightcade.Response {
    user: User,
  }

  export interface ReplayRequest extends Fightcade.Request {
    limit?: number,
    offset?: number,
    best?: boolean,
    since?: number,
    quarkid?: string,
  }

  export interface UserReplayRequest extends Fightcade.UserRequest, Fightcade.ReplayRequest {}

  export interface UserReplayResponse extends Fightcade.Response {
    results: {
      results: Replay[],
      count: number,
    },
  }

  export interface RankingRequest extends Fightcade.Request {
    offset?: number,
    limit?: number,
    gameid: string,
    byElo?: boolean,
    recent?: boolean,
  }

  export interface RankingResponse extends Fightcade.Response {
    results: {
      results: Player[],
      count: number,
    },
  }
}

/**
 * Fightcade Rank Interface
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the top 15 ranked UMK3 players and their ranks.
 * const gameid = 'umk3';
 * const rankings = await Fightcade.GetRankings(gameid);
 * rankings.forEach(player => {
 *  if (player.gameinfo && player.gameinfo[gameid].rank)
 *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
 * });
 * ```
 *
 * @public
 */
export enum Rank {
  E = 1,
  D,
  C,
  B,
  A,
  S,
}

/**
 * GameInfo Interface
 *
 * @param rank - The Fightcade game {@link Rank}.
 * @param num_matches - The number of ranked games played.
 * @param last_match - Millisecond Epoch Date Timestamp of the last match played.
 * @param time_played - Amount of time played in Milliseconds.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the user 'biggs' amount of ranked matches per game.
 * const user = await Fightcade.GetUser('biggs');
 * for (const gameid in user.gameinfo)
 *   if (user.gameinfo[gameid].rank)
 *    console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
 * ```
 *
 * @public
 */
export interface GameInfo {
  [gameid: string]: {
    rank?: Rank,
    num_matches?: number,
    last_match?: number,
    time_played: number,
  },
}


/**
 * User Interface
 *
 * @param name - The Fightcade game username.
 * @param gravatar - The Gravatar URL.
 * @param ranked - Is the user a ranked player?
 * @param last_online - The Millisecond Epoch Date Timestamp of last logout.
 * @param date - The Millisecond Epoch Date Timestamp of account creation.
 * @param gameinfo - The {@link GameInfo} object.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the user 'biggs' account creation date.
 * const user = await Fightcade.GetUser('biggs');
 * const date = new Date(user.date);
 * console.log(date.toString());
 * ```
 *
 * @public
 */
export interface User {
  name: string,
  gravatar?: string,
  ranked: boolean,
  last_online?: number,
  date: number,
  gameinfo?: GameInfo,
}

/**
 * Retrieves Fightcade user data.
 *
 * @param username - The Fightcade username.
 * @returns The retrieved {@link User} object.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the user 'biggs' amount of ranked matches per game.
 * const user = await Fightcade.GetUser('biggs');
 * for (const gameid in user.gameinfo)
 *   if (user.gameinfo[gameid].rank)
 *     console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
 * ```
 *
 * @throws {@link Fightcade.Res.USER_NOT_FOUND} This exception is thrown if the user is not found.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetUser(username: string): Promise<User> {
  const request: Fightcade.UserRequest = {
    req: Fightcade.Req.GET_USER,
    username: username,
  };
  const response: Response = await fetch(Fightcade.URL.API, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const user_response: Fightcade.UserResponse = await response.json();
  if (user_response.res !== Fightcade.Res.OK) throw new Error(user_response.res);
  else return user_response.user;
}

/**
 * Country Interface.
 *
 * @param iso_code - ISO 3166-1 alpha2 country code.
 * @param full_name - The country name.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the player names and countries from replay '1638725293444-1085'.
 * const replay: Replay = await Fightcade.GetReplay('1638725293444-1085');
 * replay.players.forEach(player => {
 *  if (typeof player.country === 'string') console.log(`${player.name}: ${player.country}`);
 *  else console.log(`${player.name}: ${player.country.full_name}`);
 * });
 * ```
 *
 * @public
 */
export interface Country {
  iso_code: string,
  full_name: string,
}

/**
 * Player Interface.
 *
 * @param name - The Fightcade username.
 * @param country - The country name or {@link Country} object.
 * @param rank - The user game rank.
 * @param score - The match score.
 * @param gameinfo - The {@link GameInfo} object.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the player names from replay '1638725293444-1085'.
 * const replay: Replay = await Fightcade.GetReplay('1638725293444-1085');
 * replay.players.forEach(player => {
 *  console.log(player.name);
 * });
 * ```
 *
 * @public
 */
export interface Player {
  name: string,
  country: string | Country,
  rank: Rank,
  score: number,
  gameinfo?: GameInfo
}

/**
 * Replay Interface.
 *
 * @param quarkid - The Challenge ID.
 * @param channelname - The Fightcade game channel name name.
 * @param date - The Millisecond Epoch Date Timestamp of the replay.
 * @param duration - The duration of the replay in Seconds.
 * @param emulator - The emulator name.
 * @param gameid - The Fightcade rom name.
 * @param num_matches - The number of matches in the replay.
 * @param players - The list of players in the replay.
 * @param ranked - Was this replay a ranked match?
 * @param replay_file - The replay file name.
 * @param realtime_views - The total amount of live spectators.
 * @param saved_views - The amount of replay views.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the date of replay '1638725293444-1085'.
 * const replay = await Fightcade.GetReplay('1638725293444-1085');
 * const date = new Date(replay.date);
 * console.log(date.toString());
 * ```
 *
 * @public
 */
export interface Replay {
  quarkid: string,
  channelname: string,
  date: number,
  duration: number,
  emulator: string,
  gameid: string,
  num_matches: number,
  players: Player[],
  ranked: number,
  replay_file?: string,
  realtime_views?: number,
  saved_views?: number,
}

/**
 * Retrieves the Fightcade {@link Replay} object by Challenge ID.
 *
 * @param quarkid - Fightcade Challenge ID
 * @returns The retrieved {@link Replay} object.
 *
 * @exmaple
 * Here is a simple example
 * ```ts
 * // Print the date of the replay 1638725293444-1085
 * const replay = await Fightcade.GetReplay('1638725293444-1085');
 * const date = new Date(replay.date);
 * console.log(date.toString());
 * ```
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplay(quarkid: string): Promise<Replay> {
  const request: Fightcade.ReplayRequest = {
    req: Fightcade.Req.SEARCH_QUARKS,
    quarkid: quarkid,
  };
  const response = await fetch(Fightcade.URL.API, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const replay: Fightcade.UserReplayResponse = await response.json();
  if (replay.res !== Fightcade.Res.OK) throw new Error(replay.res);
  else if (replay.results.results[0] === undefined) throw new RangeError();
  else return replay.results.results[0];
}

/**
 * Retrieves the 15 most recent Fightcade replays.
 *
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 15 most recent replays.
 * const replays = await Fightcade.GetReplays();
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the most recent Fightcade replays.
 *
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 30 most recent replays.
 * const replays = await Fightcade.GetReplays(30, 0);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(limit: number, offset: number): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the most recent best Fightcade replays.
 *
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @returns The retrieved list of {@link Replay} objects.
 *
 *  @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 5 most recent best replays.
 * const replays = await Fightcade.GetReplays(5, 0, true);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(limit: number, offset: number, best: boolean): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the most recent best Fightcade replays since a specified date.
 *
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @param since - Millisecond Epoch Timestamp Date.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 5 most recent best replays since 1658032210798.
 * const replays = await Fightcade.GetReplays(5, 0, true, 1658032210798);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>;
export async function GetReplays(limit?: number, offset?: number, best?: boolean, since?: number): Promise<Replay[]> {
  const request: Fightcade.ReplayRequest = {
    req: Fightcade.Req.SEARCH_QUARKS,
  };
  if (limit !== undefined && offset !== undefined && best !== undefined && since !== undefined) {
    request.limit = limit;
    request.offset = offset;
    request.best = best;
    request.since = since;
  } else if (limit !== undefined && offset !== undefined && best !== undefined) {
    request.limit = limit;
    request.offset = offset;
    request.best = best;
  } else if (limit !== undefined && offset !== undefined) {
    request.limit = limit;
    request.offset = offset;
  }
  const response: Response = await fetch(Fightcade.URL.API, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const replays_response: Fightcade.UserReplayResponse = await response.json();
  if (replays_response.res !== Fightcade.Res.OK) throw new Error(replays_response.res);
  else if (replays_response.results.count !== replays_response.results.results.length + 1) throw new RangeError();
  else return replays_response.results.results;
}

/**
 * Retrieves the Fightcade user's 15 most recent replays.
 *
 * @param username - The Fightcade username.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 15 most recent replays belonging to the user 'biggs'.
 * const replays = await Fightcade.GetUserReplays('biggs');
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetUserReplays(username: string): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the Fightcade user's most recent replays.
 *
 * @param username - The Fightcade username.
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 30 most recent replays belonging to the user 'biggs'.
 * const replays = await Fightcade.GetUserReplays('biggs', 30, 0);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetUserReplays(username: string, limit: number, offset: number): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the Fightcade user's most recent replays.
 *
 * @param username - The Fightcade username.
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 30 most recent best replays belonging to the user 'biggs'.
 * const replays = await Fightcade.GetUserReplays('biggs', 30, 0, true);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean): Promise<Replay[]>;

/**
 * Retrieves a specified amount of the Fightcade user's most recent replays.
 *
 * @param username - The Fightcade username.
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @param since - Millisecond Epoch Timestamp Date.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @example
 * Here is a simple example
 * ```ts
 * // Print the game channel names of the 30 most recent best replays belonging to the user 'biggs' since 1658032210798.
 * const replays = await Fightcade.GetUserReplays('biggs', 30, 0, true, 1658032210798);
 * replays.forEach(replay => console.log(replay.channelname));
 * ```
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>;
export async function GetUserReplays(username: string, limit?: number, offset?: number, best?: boolean, since?: number): Promise<Replay[]> {
  const request: Fightcade.UserReplayRequest = {
    req: Fightcade.Req.SEARCH_QUARKS,
    username: username,
  };
  if (limit !== undefined && offset !== undefined && best !== undefined && since !== undefined) {
    request.limit = limit;
    request.offset = offset;
    request.best = best;
    request.since = since;
  } else if (limit !== undefined && offset !== undefined && best !== undefined) {
    request.limit = limit;
    request.offset = offset;
    request.best = best;
  } else if (limit !== undefined && offset !== undefined) {
    request.limit = limit;
    request.offset = offset;
  }
  const response: Response = await fetch(Fightcade.URL.API, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const user_replays_response: Fightcade.UserReplayResponse = await response.json();
  if (user_replays_response.res !== Fightcade.Res.OK) throw new Error(user_replays_response.res);
  else if (user_replays_response.results.count !== user_replays_response.results.results.length + 1) throw new RangeError();
  else return user_replays_response.results.results;
}

/**
 * Get the URL used to open a replay in Fightcade.
 *
 * @param replay - The {@link Replay} object.
 * @returns The URL string used to open a replay in Fightcade.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the replay URLs of a user's 15 most recent replays.
 * const user_replays = await Fightcade.GetUserReplays('biggs');
 * user_replays.forEach(replay => console.log(Fightcade.GetReplayURL(replay)));
 * ```
 *
 * @public
 */
export function GetReplayURL(replay: Replay): string {
  return `${Fightcade.URL.REPLAY}${replay.emulator}/${replay.gameid}/${replay.quarkid}`;
}

/**
 * Get the video URL of a replay submitted to FightcadeVids.
 * This function does not guarantee that URL exists.
 * It only returns what the URL would be if the replay was submitted.
 *
 * @param replay - The {@link Replay} object.
 * @returns The video URL the replay submitted to FightcadeVids.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print what the video URLs would be for a user's 15 most recent replays.
 * const user_replays = await Fightcade.GetUserReplays('biggs');
 * user_replays.forEach(replay => console.log(Fightcade.GetVideoURL(replay)));
 * ```
 *
 * @public
 */
export function GetVideoURL(replay: Replay): string;
/**
 * Get the video URL of a replay submitted to FightcadeVids.
 * This function does not guarantee that URL exists.
 * It only returns what the URL would be if the replay was submitted.
 *
 * @param replay - The Challenge ID string.
 * @returns The video URL the replay submitted to FightcadeVids.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the video URL of the replay 1638725293444-1085.
 * const quarkid = '1638725293444-1085';
 * console.log(Fightcade.GetVideoURL(quarkid));
 * ```
 *
 * @public
 */
export function GetVideoURL(replay: string): string;
export function GetVideoURL(replay: Replay | string): string {
  if (typeof replay === 'string') return `${Fightcade.URL.VIDEO}${replay}`;
  else return `${Fightcade.URL.VIDEO}${replay.quarkid}`;
}

/**
 * Gets the top 15 ranked players for a game.
 *
 * @param gameid - The ranked game rom name.
 * @param byElo - Request that the players be sorted by ELO.
 * @param recent - Request that the rankings include only recent players.
 * @returns A ranked list of {@link Player} objects.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the top 15 ranked UMK3 players and their ranks.
 * const gameid = 'umk3';
 * const rankings = await Fightcade.GetRankings(gameid);
 * rankings.forEach(player => {
 *  if (player.gameinfo && player.gameinfo[gameid].rank)
 *    console.log(`${Fightcade.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
 * });
 * ```
 *
 * @public
 */
export async function GetRankings(gameid: string, byElo: boolean = true, recent: boolean = true) {
  const request: Fightcade.RankingRequest = {
    req: Fightcade.Req.SEARCH_RANKINGS,
    gameid: gameid,
    byElo: byElo,
    recent: recent,
  };
  const response: Response = await fetch(Fightcade.URL.API, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const ranking_response: Fightcade.RankingResponse = await response.json();
  if (ranking_response.res !== Fightcade.Res.OK) throw new Error(ranking_response.res);
  else if (ranking_response.results.count !== ranking_response.results.results.length + 1) throw new RangeError();
  else return ranking_response.results.results;
}
