declare module 'haxball.js' {
  import 'haxball-headless-browser';

  interface RoomConfig extends RoomConfigObject {
    token: string;
    proxy?: string;
    debug?: boolean;
    webrtc?: {
      RTCPeerConnection: typeof RTCPeerConnection;
      RTCIceCandidate: typeof RTCIceCandidate;
      RTCSessionDescription: typeof RTCSessionDescription;
    };
  }

  export function HBInit(config: RoomConfig): Promise<RoomObject>;
}
