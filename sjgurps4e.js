import {sjgurps4e} from "./module/config.js";
import sjgurps4eItemSheet from "./module/item/sheet.js";
import sjgurps4eActorSheet from "./module/actor/sheet.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import sjgurps4eActor from "./module/actor/entity.js";
import sjgurps4eItem from "./module/item/entity.js";
import { registerSystemSettings } from "./module/settings.js";
import { _getInitiativeFormula } from "./module/combat.js";

Hooks.once("init", function (){
    console.log("sjgurps4e | Initializing GURPS 4e");
    console.log(sjgurps4e.ASCII);

    game.sjgurps4e ={
      applications: {
        sjgurps4eActor,
        sjgurps4eActorSheet
      },
      config: sjgurps4e,
      entities: {
        sjgurps4eActor,
        sjgurps4eItem,
        }

    }

    CONFIG.sjgurps4e = sjgurps4e;
    CONFIG.Actor.entityClass = sjgurps4eActor;
    CONFIG.Item.entityClass = sjgurps4eItem;

    // Register System Settings
    registerSystemSettings();

     // set up the baseline inititive formula
     CONFIG.Combat.initiative.formula = String("@baseSpeed + (1d6/1000)");
     Combat.prototype._getInitiativeFormula = _getInitiativeFormula;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sjgurps4e", sjgurps4eItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("sjgurps4e", sjgurps4eActorSheet, {makeDefault: true});

    // Preload Handlebars Templates
    preloadHandlebarsTemplates();

     //calculate point costs for attribute values
    Handlebars.registerHelper("statValue", function(n, string, ST = 10){
      let result = '';
      // yeah yeah I know it's a multiplier... it used to be a division thing but I changed it and 
      // was too lazy to change the code :P
      let divisor = '';
      let baseValue = 10;
      if(string === "ST" || string === "HT"){
        divisor = 10;
      } else if (string === "DX" || string === "IQ"){
        divisor = 20;
      } else if (string === "Will" || string === "Per") {
        divisor = 5;
      } else if (string === "HP") {
        divisor = 2;
        //console.log("*-* ST is currently: " + ST);
        baseValue = ST;
      } else if (string === "FP"){
        //console.log("*-* HT is currently: " + ST);
        baseValue = ST;
        divisor = 3;
      }
      result = (n-baseValue)*divisor;
      //console.log("*-* value of n in handlebarhelper " + n);
      //console.log("*-* value of divisor in helper " + divisor);
      return result;
    });  

    Handlebars.registerHelper('getProperty', function (data, property) {
      return getProperty(data, property);
    });

    Handlebars.registerHelper('getRollTarget', function(data, item, skill, mod){
      return;
    })
 
    Handlebars.registerHelper('localizeData', function (locationString, datastring){
      let localizationLocation = "";
      //console.log(datastring);
      if(datastring == ""){
        localizationLocation = "sjgurps4e."+locationString+"."+"none";
      } else {
      localizationLocation = "sjgurps4e."+locationString+"."+datastring;
      }
      //console.log(localizationLocation);
      return game.i18n.localize(localizationLocation);

    });

})


/**
 * Set default values for new actors' tokens
 */
Hooks.on("preCreateActor", (createData) =>{
  // Set custom default token
  if (!createData.img)
    createData.img = "systems/sjgurps4e/icons/new_actor.png"
})

