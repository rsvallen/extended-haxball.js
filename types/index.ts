/**
 * TypeScript Definitions for the HaxBall Headless Host API and Stadium File Structures.
 * * This file provides strongly typed interfaces and enums for both controlling
 * the headless room (RoomObject) and defining custom stadiums (.hbs files).
 */

// 1. Core Types and Enums

/**
 * Defines the possible team identifiers in a HaxBall room.
 * * Usage: Used to set a player's team, check a player's team, or identify
 * which team scored a goal.
 * * Main properties:
 * - Spectators (0): Players who are watching the game.
 * - Red (1): Players on the red team.
 * - Blue (2): Players on the blue team.
 */
enum TeamID {
  Spectators = 0,
  Red = 1,
  Blue = 2,
}

/**
 * Defines a simple 2D coordinate structure.
 * * Usage: Used to represent the position of the ball or a player's last recorded position.
 * * Main properties:
 * - x: The horizontal coordinate.
 * - y: The vertical coordinate.
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Defines the geographical coordinates object used for room configuration.
 * * Usage: Used in the RoomConfigObject to set a preferred geographical location
 * for the host (e.g., to influence stadium sorting).
 * * Main properties:
 * - code: The country code (e.g., "DE", "US").
 * - lat: The latitude of the location.
 * - lon: The longitude of the location.
 */
interface GeoCoordinates {
  code: string;
  lat: number;
  lon: number;
}

// 2. Player and Score Objects

/**
 * Represents the current scores and time limits of the game.
 * * Usage: Retrieved using room.getScores() and passed to the onTeamVictory event.
 * * Main properties:
 * - red/blue: The current scores for each team.
 * - time: The current time elapsed in the match (in seconds).
 * - scoreLimit/timeLimit: The set limits for the match.
 */
interface ScoresObject {
  red: number;
  blue: number;
  time: number;
  scoreLimit: number;
  timeLimit: number;
}

/**
 * Represents a player currently in the room.
 * * Usage: This is the primary object used to interact with players (e.g., kicking,
 * changing team/admin status) and is passed to almost all player-related event handlers.
 * * Main properties:
 * - id: Unique identifier for the player.
 * - name: The player's display name.
 * - team: The player's current TeamID.
 * - admin: Boolean indicating administrator status.
 * - auth: The player's public ID, useful for account implementation[cite: 1912].
 * - conn: A string that uniquely identifies the player's connection[cite: 1915].
 */
interface PlayerObject {
  id: number;
  name: string;
  team: TeamID;
  admin: boolean;
  position: Position | null;
  auth: string | null;
  conn: string;
}

// 3. Headless Host API Physics Types

/**
 * Defines the full set of physical properties for a disc (e.g., the ball or a player's "disc").
 * * Usage: Used for retrieving the full state of a disc via getDiscProperties/getPlayerDiscProperties.
 * Fields are represented as raw numbers (floats/integers) for the runtime API.
 * * Main properties:
 * - x, y: Current position.
 * - xspeed, yspeed: Current velocity.
 * - radius: Size of the disc.
 * - cMask, cGroup: Bitmasks controlling physics collision behavior.
 */
interface DiscPropertiesObject {
  x: number;
  y: number;
  xspeed: number;
  yspeed: number;
  xgravity: number;
  ygravity: number;
  radius: number;
  bCoeff: number;
  invMass: number;
  damping: number;
  color: number;
  cMask: number;
  cGroup: number;
}

/**
 * Utility type to allow setting only a subset of a disc's properties in API calls.
 * * Usage: Used as the argument for setDiscProperties and setPlayerDiscProperties.
 */
type PartialDiscProperties = Partial<DiscPropertiesObject>;

/**
 * Defines the bitmask values for collision groups and masks.
 * * Usage: Accessed as a property of the RoomObject (room.CollisionFlags) to set
 * custom collision behavior when manipulating disc properties at runtime.
 * * Main properties:
 * - ball, red, blue, wall, kick, score: Standard flag constants for common game elements[cite: 1920].
 * - c0, c1, c2, c3: Custom flags available for stadium creators[cite: 1920].
 */
interface CollisionFlagsObject {
  ball: number;
  red: number;
  blue: number;
  redKO: number;
  blueKO: number;
  wall: number;
  all: number;
  kick: number;
  score: number;
  c0: number;
  c1: number;
  c2: number;
  c3: number;
}

// 4. Stadium File (.hbs) Structures

/**
 * Defines a color representation in the Stadium (.hbs) file format.
 * * Usage: Used for coloring discs, segments, joints, and the background.
 * * Possible values:
 * - "transparent"
 * - Hex string: e.g., "FF0000" (Red)
 * - RGB Array: e.g., [0, 200, 0] (Green)[cite: 1631, 1632].
 */
type Color = 'transparent' | string | [number, number, number];

/**
 * Defines the shape and attributes of a Vertex (a point) in a stadium.
 * * Usage: Used in the StadiumObject's 'vertexes' list to define endpoints for segments.
 * * Main properties:
 * - x, y: Position coordinates[cite: 1504].
 * - bCoef: Bouncing coefficient[cite: 1505].
 * - cMask/cGroup: Collision flags defined as a string array (e.g., ["ball", "wall"])[cite: 1505, 1506].
 */
interface Vertex {
  bCoef?: number;
  cMask?: string[];
  cGroup?: string[];
  trait?: string;
}

/**
 * Defines a Segment (a line, curved or straight) connecting two vertexes.
 * * Usage: Used in the StadiumObject's 'segments' list to create walls and boundaries[cite: 1508].
 * * Main properties:
 * - v0, v1: Indexes of the two connected vertexes in the `vertexes` array[cite: 1510, 1511].
 * - curve: The angle in degrees with which the segment will curve[cite: 1512].
 * - bias: Allows the creation of one-way walls (thickness)[cite: 1516].
 * - vis: Visibility boolean[cite: 1544].
 */
interface Segment {
  v0: number;
  v1: number;
  bCoef?: number;
  curve?: number;
  curveF?: number;
  bias?: number;
  vis?: boolean;
  color?: Color;
  cMask?: string[];
  cGroup?: string[];
  trait?: string;
}

/**
 * Defines a Goal line belonging to a team.
 * * Usage: Used in the StadiumObject's 'goals' list. When a disc with the 'score' collision flag
 * crosses this line, the opposite team scores a goal[cite: 1547, 1705].
 * * Main properties:
 * - p0, p1: Coordinates of the line's start and end points[cite: 1548, 1549].
 * - team: Specifies which team the goal belongs to ("red" or "blue")[cite: 1550].
 */
interface Goal {
  p0: [number, number];
  p1: [number, number];
  team: 'red' | 'blue';
  trait?: string;
}

/**
 * Defines a Plane (an infinite collision line).
 * * Usage: Used in the StadiumObject's 'planes' list, often for creating the boundaries of the stadium[cite: 1552, 1553].
 * * Main properties:
 * - normal: A direction vector[cite: 1554].
 * - dist: Distance from the origin in the direction of the normal[cite: 1555].
 * - bCoef: Bouncing coefficient.
 */
interface Plane {
  normal: [number, number];
  dist: number;
  bCoef?: number;
  cMask?: string[];
  cGroup?: string[];
  trait?: string;
}

/**
 * Defines a Disc object for the stadium file. These are static or custom physics objects.
 * The first disc in the list may be used as the ball if `ballPhysics` is set to "disc0"[cite: 1635].
 * * Usage: Used in the StadiumObject's 'discs' list to create static obstacles or custom moveable objects.
 * * Main properties:
 * - pos: Starting position[cite: 1583].
 * - speed: Starting speed vector[cite: 1583].
 * - radius, invMass, damping, bCoef: Key physical properties[cite: 1585, 1586, 1587].
 * - color: Disc fill color[cite: 1586].
 */
interface Disc {
  pos: [number, number];
  speed?: [number, number];
  gravity?: [number, number];
  radius: number;
  invMass?: number;
  damping?: number;
  color?: Color;
  bCoef?: number;
  cMask?: string[];
  cGroup?: string[];
  trait?: string;
}

/**
 * Defines a Joint used to connect two discs together.
 * * Usage: Used in the StadiumObject's 'joints' list to create dynamic structures (e.g., chains or ropes).
 * * Main properties:
 * - d0, d1: Indexes of the two discs to connect[cite: 1622].
 * - length: Defines the fixed, minimum, or maximum length of the joint[cite: 1623, 1625].
 * - strength: Defines if the joint is `"rigid"` (solid) or acts like a spring (float value)[cite: 1627, 1628].
 */
interface Joint {
  d0: number;
  d1: number;
  length?: null | number | [number, number];
  strength?: 'rigid' | number;
  color?: Color;
  trait?: string;
}

/**
 * Defines the global physical constants for all player discs.
 * * Usage: Used in the StadiumObject's `playerPhysics` property to override default player physics.
 * * Main properties:
 * - acceleration: How fast a player accelerates when moving[cite: 1592].
 * - kickingAcceleration: Acceleration when the kick button is held[cite: 1593].
 * - radius, invMass, bCoef, damping, cGroup: Standard disc physical properties[cite: 1592].
 */
interface PlayerPhysics {
  gravity?: [number, number];
  radius?: number;
  invMass?: number;
  bCoef?: number;
  damping?: number;
  cGroup?: string[];
  acceleration?: number;
  kickingAcceleration?: number;
}

/**
 * Defines the visual and functional background of the stadium.
 * * Usage: Used in the StadiumObject's `bg` property.
 * * Main properties:
 * - type: The style of background ("grass", "hockey", or "none")[cite: 1961].
 * - width, height, kickOffRadius, cornerRadius: Dimensions for rendering visual elements[cite: 1962, 1963, 1964].
 * - goalLine: Used by the "hockey" background type[cite: 1965].
 * - color: The background color[cite: 1965].
 */
interface BackgroundObject {
  type?: 'grass' | 'hockey' | 'none';
  width?: number;
  height?: number;
  kickOffRadius?: number;
  cornerRadius?: number;
  goalLine?: number;
  color?: Color;
}

/**
 * The root object of a HaxBall Stadium (.hbs) file.
 * * Usage: Defines the entire game pitch, its physics, boundaries, and visual style.
 * * Main sections:
 * - name, width, height: General stadium identification and dimensions[cite: 1929, 1930].
 * - cameraFollow: Defines camera behavior ("player" or "ball")[cite: 1937, 1938].
 * - vertexes, segments, goals, planes, discs, joints: Lists of physical components[cite: 1951, 1952, 1946].
 * - redSpawnPoints, blueSpawnPoints: Defines custom kickoff positions[cite: 1953, 1956].
 * - ballPhysics, playerPhysics: Overrides to default disc properties[cite: 1957, 1958].
 */
interface StadiumObject {
  name: string;
  width?: number;
  height?: number;
  maxViewWidth?: number;
  cameraFollow?: 'player' | 'ball';
  spawnDistance?: number;
  canBeStored?: boolean;
  kickOffReset?: 'full' | 'partial';
  bg?: BackgroundObject;
  traits?: Record<string, any>;
  vertexes: Vertex[];
  segments: Segment[];
  goals: Goal[];
  discs: Disc[];
  planes: Plane[];
  joints: Joint[];
  redSpawnPoints?: [number, number][];
  blueSpawnPoints?: [number, number][];
  playerPhysics?: PlayerPhysics;
  ballPhysics?: Disc | 'disc0';
}

// 5. Room Configuration (Headless Host API)

/**
 * Defines the configuration object passed to the global HBInit function.
 * * Usage: Must be supplied when initializing the headless host to set up the room's basic parameters.
 * All values are optional.
 * * Main properties:
 * - roomName, playerName, password, maxPlayers: Basic room setup[cite: 1822, 1823, 1824].
 * - token: The room creation token for authorized host status[cite: 1827].
 * - geo: Optional geographical location data[cite: 1826].
 */
interface RoomConfigObject {
  roomName?: string;
  playerName?: string;
  password?: string;
  maxPlayers?: number;
  public?: boolean;
  geo?: GeoCoordinates;
  token?: string;
  noPlayer?: boolean;
}

// Added by extended-haxball.js API, api that I will always use because its my own modification.
interface InputObject {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}

// 6. Room API Interface (RoomObject)

/**
 * Defines the supported styles for announcements sent to players.
 * * Usage: Used as a parameter in the room.sendAnnouncement method[cite: 1859].
 */
type AnnouncementStyle =
  | 'normal'
  | 'bold'
  | 'italic'
  | 'small'
  | 'small-bold'
  | 'small-italic';

/**
 * The main interface for the HaxBall headless host API.
 * * Usage: This object is returned by the HBInit function and provides all
 * methods for controlling the room, as well as properties for defining event handlers.
 * * Main sections:
 * - Methods: Functions like sendChat, startGame, kickPlayer, setPlayerAdmin, etc.
 * - Properties: Read-only data like CollisionFlags[cite: 1876].
 * - Event Handlers: Optional function properties (e.g., onPlayerJoin, onGameStart)
 * that the host script implements to react to game events[cite: 1879].
 */
interface RoomObject {
  // Methods
  sendChat(message: string, targetId?: number): void;
  setPlayerAdmin(playerID: number, admin: boolean): void;
  setPlayerTeam(playerID: number, team: TeamID): void;
  kickPlayer(playerID: number, reason: string, ban: boolean): void;
  clearBan(playerId: number): void;
  clearBans(): void;
  setScoreLimit(limit: number): void;
  setTimeLimit(limitInMinutes: number): void;
  setCustomStadium(stadiumFileContents: string): void;
  setDefaultStadium(stadiumName: string): void;
  setTeamsLock(locked: boolean): void;
  setTeamColors(
    team: TeamID,
    angle: number,
    textColor: number,
    colors: number[]
  ): void;
  startGame(): void;
  stopGame(): void;
  pauseGame(pauseState: boolean): void;
  getPlayer(playerId: number): PlayerObject | null;
  getPlayerList(): PlayerObject[];
  getScores(): ScoresObject | null;
  getBallPosition(): Position | null;
  startRecording(): void;
  stopRecording(): Uint8Array | null;
  setPassword(pass: string | null): void;
  setRequireRecaptcha(required: boolean): void;
  reorderPlayers(playerIdList: number[], moveToTop: boolean): void;
  sendAnnouncement(
    msg: string,
    targetId?: number,
    color?: number,
    style?: AnnouncementStyle,
    sound?: number
  ): void;
  setKickRateLimit(min: number, rate: number, burst: number): void;
  setPlayerAvatar(playerId: number, avatar: string | null): void;
  setDiscProperties(discIndex: number, properties: PartialDiscProperties): void;
  getDiscProperties(discIndex: number): DiscPropertiesObject | null;
  setPlayerDiscProperties(
    playerId: number,
    properties: PartialDiscProperties
  ): void;
  getPlayerDiscProperties(playerId: number): DiscPropertiesObject | null;
  getDiscCount(): number;

  //Additions
  onPlayerInput(player: PlayerObject, input: InputObject): void;
  getInputObject(playerId: number): InputObject | null;
  resetPositions(): void;

  // Properties
  /** The object containing the bitmask values for collision flags (e.g., room.CollisionFlags.ball). */
  CollisionFlags: CollisionFlagsObject;

  // Event Handlers (Optional and can be assigned by the host)
  onPlayerJoin?(player: PlayerObject): void;
  onPlayerLeave?(player: PlayerObject): void;
  onTeamVictory?(scores: ScoresObject): void;
  onPlayerChat?(player: PlayerObject, message: string): boolean | void;
  onPlayerBallKick?(player: PlayerObject): void;
  onTeamGoal?(team: TeamID): void;
  onGameStart?(byPlayer: PlayerObject | null): void;
  onGameStop?(byPlayer: PlayerObject | null): void;
  onPlayerAdminChange?(
    changedPlayer: PlayerObject,
    byPlayer: PlayerObject | null
  ): void;
  onPlayerTeamChange?(
    changedPlayer: PlayerObject,
    byPlayer: PlayerObject | null
  ): void;
  onPlayerKicked?(
    kickedPlayer: PlayerObject,
    reason: string,
    ban: boolean,
    byPlayer: PlayerObject | null
  ): void;
  onGameTick?(): void;
  onGamePause?(byPlayer: PlayerObject | null): void;
  onGameUnpause?(byPlayer: PlayerObject | null): void;
  onPositionsReset?(): void;
  onPlayerActivity?(player: PlayerObject): void;
  onStadiumChange?(newStadiumName: string, byPlayer: PlayerObject | null): void;
  onRoomLink?(url: string): void;
  onKickRateLimitSet?(
    min: number,
    rate: number,
    burst: number,
    byPlayer: PlayerObject | null
  ): void;
  onTeamsLockChange?(locked: boolean, byPlayer: PlayerObject | null): void;
}

// 7. Global API Functions (declared as ambient functions)

/**
 * The main initialization function for the HaxBall headless host.
 * * Usage: This is the first function called by the host environment. It must
 * return the RoomObject instance which the host script will use to control the room.
 * * @param roomConfig The configuration object for setting up the room.
 * @returns A RoomObject instance used for room control and event handling.
 */
declare function HBInit(roomConfig: RoomConfigObject): RoomObject;

/**
 * A callback function that is executed once the HaxBall host environment has loaded.
 * * Usage: Typically, this function is defined by the host script to signal that
 * the environment is ready for initialization logic.
 */
declare function onHBLoaded(): void;
