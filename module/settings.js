export const registerSystemSettings = function() {

    //ask for DR usage variant
    // Basic - all damage to center mass only use torso DR
    // Intermediate - expand to 6 hit locations arm/leg/foot/hand/head/toros
    // Detailed - expand to 12 hit locations rHand/lHand/rFoot/lFoot/rLeg/lLeg/rArm/lArm/groin/torso/neck/head
    game.settings.register("sjgurps4e", "hitLocationScope", {
        name: "SETTINGS.hitLocationScope",
        scope: "world",
        config: true,
        default: "basic",
        type: String,
        choices: {
            "basic": "SETTINGS.hitScopeBasic",
            "intermediate" : "SETTINGS.hitScopeIntermediate",
            "Detailed": "SETTINGS.hitScopeDetailed"
        }

    });


      /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("sjgurps4e", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });


    /**
   * Register Initiative formula setting
   */
  game.settings.register("sjgurps4e", "initTieBreaker", {
    name: "SETTINGS.InitTBN",
    hint: "SETTINGS.InitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

}