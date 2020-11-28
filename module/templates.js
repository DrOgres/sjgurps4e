/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

    // Define template paths to load
    const templatePaths = [
  
      // Actor Sheet Partials
      "systems/sjgurps4e/templates/actors/parts/statblock.hbs",
      "systems/sjgurps4e/templates/actors/parts/pools.hbs",
      "systems/sjgurps4e/templates/actors/parts/actor-inventory.hbs",
      "systems/sjgurps4e/templates/actors/parts/weapon-card.hbs",
      "systems/sjgurps4e/templates/actors/parts/core-actor.hbs",
      "systems/sjgurps4e/templates/actors/parts/equip-card.hbs",
      "systems/sjgurps4e/templates/actors/parts/actor-skills.hbs",
      "systems/sjgurps4e/templates/actors/parts/skill-card.hbs",
      "systems/sjgurps4e/templates/actors/parts/actor-spells.hbs",
      "systems/sjgurps4e/templates/actors/parts/actor-traits.hbs",
      "systems/sjgurps4e/templates/actors/parts/active-defense.hbs",
      "systems/sjgurps4e/templates/actors/parts/encumbrance.hbs",
      "systems/sjgurps4e/templates/actors/parts/favorites.hbs",
      "systems/sjgurps4e/templates/actors/parts/actor-notes.hbs",
      //"systems/sjgurps4e/templates/actors/parts/actor-spellbook.html",
      //"systems/sjgurps4e/templates/actors/parts/actor-effects.html",
  
      // Item Sheet Partials
      //"systems/sjgurps4e/templates/items/parts/item-action.html",
      //"systems/sjgurps4e/templates/items/parts/item-activation.html",
      "systems/sjgurps4e/templates/items/parts/item-description.hbs",
      //"systems/sjgurps4e/templates/items/parts/item-mountable.html"
    ];
  
    // Load the template parts
    return loadTemplates(templatePaths);
  };
  