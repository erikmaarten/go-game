@0xeb08488094bac288;

using Spk = import "/sandstorm/package.capnp";
# This imports:
#   $SANDSTORM_HOME/latest/usr/include/sandstorm/package.capnp
# Check out that file to see the full, documented package definition format.

const pkgdef :Spk.PackageDefinition = (
  # The package definition. Note that the spk tool looks specifically for the
  # "pkgdef" constant.

  id = "r75g5cp60zsc3u80zt278kek9v84k786c0tf7mm30hwhvu2njrg0",
  # Your app ID is actually its public key. The private key was placed in
  # your keyring. All updates must be signed with the same key.

  manifest = (
    # This manifest is included in your app package to tell Sandstorm
    # about your app.

    appTitle = (defaultText = "Go"),

    appVersion = 2,  # Increment this for every release.

    appMarketingVersion = (defaultText = "0.2.0"),
    # Human-readable representation of appVersion. Should match the way you
    # identify versions of your app in documentation and marketing.

    actions = [
      # Define your "new document" handlers here.
      ( title = (defaultText = "New Game (9x9)"),
        command = .actionNewGame9
        # The command to run when starting for the first time. (".myCommand"
        # is just a constant defined at the bottom of the file.)
      ),
      ( title = (defaultText = "New Game (19x19)"),
        command = .actionNewGame19
        # The command to run when starting for the first time. (".myCommand"
        # is just a constant defined at the bottom of the file.)
      )
    ],

    continueCommand = .actionContinue,
    # This is the command called to start your app back up after it has been
    # shut down for inactivity.

    metadata = (
      icons = (
        appGrid = (png = (dpi1x = embed "app-graphics/appGrid_128.png")),
        grain = (png = (dpi1x = embed "app-graphics/grain_24.png")),
        market = (png = (dpi1x = embed "app-graphics/market_150.png")),
        marketBig = (png = (dpi1x = embed "app-graphics/marketBig_300.png")),
      ),

      website = "https://github.com/erikmaarten/go-game",
      codeUrl = "https://github.com/erikmaarten/go-game",
      license = (openSource = agpl3),
      categories = [games],

      author = (
        contactEmail = "e.andersson@gmail.com",
        pgpSignature = embed "pgpSignature"
      ),

      pgpKeyring = embed "pgp-keyring",

      shortDescription = (defaultText = "Board game"),
      description = (defaultText = "Go (or Wéiqí) is the traditional Chinese board game for two players. Easy to learn and play, difficult to master. This game does _not_ support human vs computer play. To invite an opponent, use Sandstorm's 'Share access' button."),

      screenshots = [
        (width = 707, height = 522, png = embed "app-graphics/screen_707x522.png")
      ],

    ),
  ),

  sourceMap = (
    # The following directories will be copied into your package.
    searchPath = [
      ( sourcePath = "/home/vagrant/bundle" ),
      ( sourcePath = "/opt/meteor-spk/meteor-spk.deps" ),
    ]
  ),

  alwaysInclude = [ "." ],
  # This says that we always want to include all files from the source map.
  # (An alternative is to automatically detect dependencies by watching what
  # the app opens while running in dev mode. To see what that looks like,
  # run `spk init` without the -A option.)

  bridgeConfig = (
    viewInfo = (
      permissions = [(
          name = "black_player",
          title = (defaultText = "Black player"),
          description = (defaultText = "grants permission to play as black")
        ),(
          name = "white_player",
          title = (defaultText = "White player"),
          description = (defaultText = "grants permission to play as white")
        ),(
          name = "viewer",
          title = (defaultText = "Viewer"),
          description = (defaultText = "grants permission to view the game")
        )
      ],
      roles = [(
          title = (defaultText = "Black player"),
          permissions = [true, false, false],
          verbPhrase = (defaultText = "plays as black"),
          default = true
        ),(
          title = (defaultText = "White player"),
          permissions = [false, true, false],
          verbPhrase = (defaultText = "plays as white")
        ),(
          title = (defaultText = "Viewer"),
          permissions = [false, false, true],
          verbPhrase = (defaultText = "can view the game")
        )
      ]
    )
  )
);

const actionNewGame9 :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/sandstorm-http-bridge", "8000", "--", "/opt/app/.sandstorm/launcher.sh"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin"),
    (key = "GO_BOARD_WIDTH", value = "9")
  ]
);

const actionNewGame19 :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/sandstorm-http-bridge", "8000", "--", "/opt/app/.sandstorm/launcher.sh"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin"),
    (key = "GO_BOARD_WIDTH", value = "19")
  ]
);

const actionContinue :Spk.Manifest.Command = (
  # Here we define the command used to start up your server.
  argv = ["/sandstorm-http-bridge", "8000", "--", "/opt/app/.sandstorm/launcher.sh"],
  environ = [
    # Note that this defines the *entire* environment seen by your app.
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin")
  ]
);
