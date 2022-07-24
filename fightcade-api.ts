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
    USER_NOT_FOUND = 'user not found',
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

export enum Rank {
  E = 1,
  D,
  C,
  B,
  A,
  S,
}

export interface GameInfo {
  [gameid: string]: {
    rank?: Rank,
    num_matches?: number,
    last_match?: number,
    time_played: number,
  },
}

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
 * // Print the user's amount of ranked matches per game.
 * const user = await FightcadePublicAPI.GetUser('biggs');
 * for (const gameid in user.gameinfo) {
 *   if (user.gameinfo[gameid].rank)
 *     console.log(`${gameid}: ${user.gameinfo[gameid].num_matches}`);
 * }
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
  }
  try {
    const response: Response = await fetch(Fightcade.URL.API, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const user_response: Fightcade.UserResponse = await response.json();
    if (user_response.res === Fightcade.Res.OK) {
      return user_response.user;
    } else if (user_response.res === Fightcade.Res.USER_NOT_FOUND) {
      throw Error(Fightcade.Res.USER_NOT_FOUND);
    } else {
      throw Error(user_response.res);
    }
  } catch (e) {
    throw e;
  }
}

export interface Country {
  iso_code: string,
  full_name: string,
}

export interface Player {
  name: string,
  country: string | Country,
  rank: Rank,
  score: number,
  gameinfo?: GameInfo
}

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
 * const replay = await FightcadePublicAPI.GetReplay('1638725293444-1085');
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
  }
  try {
    const response = await fetch(Fightcade.URL.API, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const replay: Fightcade.UserReplayResponse = await response.json();
    if (replay.res !== Fightcade.Res.OK) throw Error(replay.res);
    return replay.results.results[0];
  } catch (e) {
    throw e;
  }
}

/**
 * Retrieves the 15 most recent Fightcade replays.
 *
 * @returns The retrieved list of {@link Replay} objects.
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
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(limit: number, offset: number): Promise<Replay[]>;
/**
 * Retrieves a specified amount of the most recent Fightcade replays.
 *
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @returns The retrieved list of {@link Replay} objects.
 *
 * @throws {@link RangeError} This exception is thrown if the {@link Fightcade.UserReplayRequest} `results.count !== results.results.length`.
 *
 * @throws {@link Error} This exception is thrown if {@link Fightcade.UserResponse} `res !==` {@link Fightcade.Res.OK}.
 *
 * @public
 */
export async function GetReplays(limit: number, offset: number, best: boolean): Promise<Replay[]>;
/**
 * Retrieves a specified amount of the most recent Fightcade replays.
 *
 * @param limit - The amount of Fightcade replays to request beginning from the offset.
 * @param offest - The most recent replay number to request.
 * @param best - Requests to sort the recieved replays by views.
 * @param since - Millisecond Epoch Timestamp Date.
 * @returns The retrieved list of {@link Replay} objects.
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
  }
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
  try {
    const response: Response = await fetch(Fightcade.URL.API, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const replays_response: Fightcade.UserReplayResponse = await response.json();
    if (replays_response.res === Fightcade.Res.OK) {
      if (replays_response.results.count !== replays_response.results.results.length + 1) throw RangeError();
      return replays_response.results.results;
    } else {
      throw Error(replays_response.res);
    }
  } catch (e) {
    throw e;
  }
}

export async function GetUserReplays(username: string): Promise<Replay[]>;
export async function GetUserReplays(username: string, limit: number, offset: number): Promise<Replay[]>;
export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean): Promise<Replay[]>;
export async function GetUserReplays(username: string, limit: number, offset: number, best: boolean, since: number): Promise<Replay[]>;
export async function GetUserReplays(username: string, limit?: number, offset?: number, best?: boolean, since?: number): Promise<Replay[]> {
  const request: Fightcade.UserReplayRequest = {
    req: Fightcade.Req.SEARCH_QUARKS,
    username: username,
  }
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
  try {
    const response: Response = await fetch(Fightcade.URL.API, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const user_replays_response: Fightcade.UserReplayResponse = await response.json();
    if (user_replays_response.res === Fightcade.Res.OK) {
      if (user_replays_response.results.count !== user_replays_response.results.results.length + 1) throw RangeError();
      return user_replays_response.results.results;
    } else {
      throw Error(user_replays_response.res);
    }
  } catch (e) {
    throw e;
  }
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
 * const user_replays = await FightcadePublicAPI.GetUserReplays('biggs');
 * user_replays.forEach(replay => console.log(FightcadePublicAPI.GetReplayURL(replay)));
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
 * const user_replays = await FightcadePublicAPI.GetUserReplays('biggs');
 * user_replays.forEach(replay => console.log(FightcadePublicAPI.GetVideoURL(replay)));
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
 * console.log(FightcadePublicAPI.GetVideoURL(quarkid));
 * ```
 *
 * @public
 */
export function GetVideoURL(replay: string): string;
export function GetVideoURL(replay: Replay | string): string {
  if (typeof replay === 'string') {
    return `${Fightcade.URL.VIDEO}${replay}`;
  } else {
    return `${Fightcade.URL.VIDEO}${replay.quarkid}`;
  }
}

/**
 * Gets the top 15 ranked players for a game.
 *
 * @param gameid - The ranked game rom name.
 * @param beElo - Request that the players be sorted by ELO.
 * @param recent - Request that the rankings include only recent players.
 * @returns A ranked list of {@link Player} objects.
 *
 * @example
 * Here's a simple example:
 * ```ts
 * // Print the top 15 ranked UMK3 players and their ranks.
 * const gameid = 'umk3';
 * const rankings = await FightcadePublicAPI.GetRankings(gameid);
 * rankings.forEach(player => {
 *  if (player.gameinfo && player.gameinfo[gameid].rank)
 *    console.log(`${FightcadePublicAPI.Rank[player.gameinfo[gameid].rank]}: ${player.name}`);
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
  }
  try {
    const response: Response = await fetch(Fightcade.URL.API, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const ranking_response: Fightcade.RankingResponse = await response.json();
    if (ranking_response.res === Fightcade.Res.OK) {
      if (ranking_response.results.count !== ranking_response.results.results.length + 1) throw RangeError();
      return ranking_response.results.results;
    } else {
      throw Error(ranking_response.res);
    }
  } catch (e) {
    throw e;
  }
}
