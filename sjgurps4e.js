import {sjgurps4e} from "./module/config.js";
import sjgurps4eItemSheet from "./module/item/sheet.js";
import sjgurps4eActorSheet from "./module/actor/sheet.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";

Hooks.once("init", function (){
    console.log("sjgurps4e | Initializing GURPS 4e");
    console.log(sjgurps4e.ASCII);
    
    CONFIG.sjgurps4e = sjgurps4e;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sjgurps4e", sjgurps4eItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("sjgurps4e", sjgurps4eActorSheet, {makeDefault: true});


      // Preload Handlebars Templates
     preloadHandlebarsTemplates();


     //calculate point costs for attribute values
    Handlebars.registerHelper("statValue", function(n, string, ST = 10){
      let result = '';
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
      updateTotal();
      return result;
    });  

    Handlebars.registerHelper('getProperty', function (data, property) {
      return getProperty(data, property);
    });

    Handlebars.registerHelper('localizeData', function (locationString, datastring){
      let localizationLocation = "sjgurps4e."+locationString+"."+datastring;
      //console.log(localizationLocation);
      return game.i18n.localize(localizationLocation);

    });

})



function updateTotal(){
  //update the points total for the character sheet  call this after we change points
  return;
}