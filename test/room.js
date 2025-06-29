function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('HBInit Tests', function () {
  this.timeout(10000);

  beforeEach(async function () {
    await delay(5000);
  });

  it('should create room', async function () {
    this.timeout(30000);
    const { HBInit } = requireUncached('../build/index');

    let room = await HBInit({
      roomName: 'Haxball.JS',
      maxPlayers: 16,
      public: false,
      noPlayer: true,
      debug: true,
      token:
        process.env.CI_HB_HEADLESS_TOKEN || process.env.TEST_HB_HEADLESS_TOKEN,
    });

    return new Promise((resolve) => {
      room.onRoomLink = function () {
        resolve();
      };
    });
  });

  (process.env.CI_HB_PROXY || process.env.TEST_HB_PROXY ? it : it.skip)(
    'should create room (proxy)',
    async function () {
      this.timeout(30000);

      if (process.env.CI_HB_PROXY == '1') {
        // Skip this test if running in CI
        this.skip();
      }

      const { HBInit } = requireUncached('../build/index');

      let room = await HBInit({
        roomName: 'Haxball.JS',
        maxPlayers: 16,
        public: false,
        noPlayer: true,
        debug: true,
        token:
          process.env.CI_HB_HEADLESS_TOKEN ||
          process.env.TEST_HB_HEADLESS_TOKEN,

        proxy: process.env.CI_HB_PROXY || process.env.TEST_HB_PROXY,
      });

      return new Promise((resolve) => {
        room.onRoomLink = function () {
          resolve();
        };
      });
    }
  );
});
