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
    Handlebars.registerHelper("statValue", function(n, string){
      let result = '';
      let divisor = '';
      if(string === "ST" || string === "HT"){
        divisor = 10;
      } else if (string === "DX" || string === "IQ"){
        divisor = 20;
      } else if (string === "Will" || string === "Per") {
        divisor = 5;
      } else if (string === "HP") {
        divisor = 2;
      } else if (string === "FP"){
        divisor = 3;
      }
      result = (n-10)*divisor;
      console.log("*-* value of n in handlebarhelper " + n);
      console.log("*-* value of divisor in helper " + divisor);
      return result;
    });  
})