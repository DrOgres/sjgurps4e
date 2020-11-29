/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function(combatant) {
    const actor = combatant.actor;
    if ( !actor ) return actor.data.data.baseSpeed;
    const init = actor.data.data.baseSpeed;

    console.log(actor);
  
    let nd = 1;
    let mods = "";
    
    const parts = [init];
    // Optionally apply Dexterity tiebreaker
    const tiebreaker = game.settings.get("sjgurps4e", "initTieBreaker");
    if ( tiebreaker ) parts.push("1d6/100");
    console.log(parts);
    
    return parts.filter(p => p !== null).join(" + ");
  };