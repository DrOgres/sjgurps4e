export default class GURPS4eCharacterSheet extends ActorSheet {
   
   
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sjgurps4e/templates/actors/actor-sheet.hbs",
            classes: ["sjgurps4e", "sheet", "actor", "character"],
            scrollY: [".tab.core"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "core"}],
            width: 800,
            height: 800
        });
    }

    get template() {
        const path = "systems/sjgurps4e/templates/actors";
        return `${path}/${this.actor.data.type}.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.sjgurps4e;

        data["hitLocationScope"] = game.settings.get("sjgurps4e", "hitLocationScope");
        console.log("SJGURPS4E  | hitLocationScope: " + data.hitLocationScope);

        //uncomment to peek at data if needed
        console.log(data);
        

        // gather up the weapon items
        data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
        //console.log(data.weapons);
        //gather up the eqipment items
        data.equips = data.items.filter(function(item) {return item.type == "equipment"});
        //console.log(data.equips);
        //calculate the total weight for encumbrance 
        data.actor.data.totalweight = 0;
        //console.log("GURPS 4E  |  " + data.actor.data.totalweight);
        let weightPool = 0;
        for (let n = 0; n < data.weapons.length; n++){
           // console.log("GURPS 4E  |  " + data.weapons[n].data.weight);
            weightPool += data.weapons[n].data.weight;

        }
        for (let n = 0; n<data.equips.length; n++){
            weightPool += data.equips[n].data.weight;
        }
        data.actor.data.totalweight += weightPool
        //console.log("GURPS 4E  |  " + data.actor.data.totalweight);
        
        //gather up the skill items
        data.allSkills = data.items.filter(function(item) {return item.type == "skill"}); 
        //calculate those effective skill levels and point cost
        for(let n=0; n<data.allSkills.length; n++){
            let difficulty = data.allSkills[n].data.difficulty;
            let stat = data.allSkills[n].data.stat;
            let statValue = 0;
            let statMod = 0;
            let skillLevel = data.allSkills[n].data.level;
            
            // Calculate Point Cost
             if(skillLevel<3){
                //level 1 is 1 level 2 is 2 level 3 is 4
                data.allSkills[n].data.points = skillLevel;
            } else {
                data.allSkills[n].data.points = (Number(skillLevel)-2)*4;
            }
            
            if(difficulty === "EZ"){
                statMod = Number(skillLevel)-1
                // get the current stat
                switch(stat) {
                    case "ST":
                        statValue = data.actor.data.ST.value;
                        break;
                    case "DX":
                        statValue = data.actor.data.DX.value;
                        break;
                    case "IQ":
                        statValue = data.actor.data.IQ.value;
                        break;
                    case "Will":
                        statValue = data.actor.data.Will.value;
                        break;
                    case "Per":
                        statValue = data.actor.data.Per.value;
                        break;
                }
                
            }else if  (difficulty === "AV"){
                // Do the calculations for Effective Level
                // get the current stat 
                switch(stat) {
                    case "ST":
                        statValue = data.actor.data.ST.value;
                        break;
                    case "DX":
                        statValue = data.actor.data.DX.value;
                        break;
                    case "IQ":
                        statValue = data.actor.data.IQ.value;
                        break;
                    case "Will":
                        statValue = data.actor.data.Will.value;
                        break;
                    case "Per":
                        statValue = data.actor.data.Per.value;
                        break;
                }
                statMod = Number(skillLevel)-2;


            }else if (difficulty=== "HD"){
                statMod = Number(skillLevel)-3
                // get the current stat
                switch(stat) {
                    case "ST":
                        statValue = data.actor.data.ST.value;
                        break;
                    case "DX":
                        statValue = data.actor.data.DX.value;
                        break;
                    case "IQ":
                        statValue = data.actor.data.IQ.value;
                        break;
                    case "Will":
                        statValue = data.actor.data.Will.value;
                        break;
                    case "Per":
                        statValue = data.actor.data.Per.value;
                        break;
                }
            }else if (difficulty === "VH"){
                
                
                // get the current stat             
                switch(stat) {
                    case "ST":
                        statValue = data.actor.data.ST.value;
                        break;
                    case "DX":
                        statValue = data.actor.data.DX.value;
                        break;
                    case "IQ":
                        statValue = data.actor.data.IQ.value;
                        break;
                    case "Will":
                        statValue = data.actor.data.Will.value;
                        break;
                    case "Per":
                        statValue = data.actor.data.Per.value;
                        break;
                }
                statMod = Number(skillLevel)-4
                
            }
            data.allSkills[n].data.effective =  Number(statValue)+Number(statMod);
        }
      
        
        //separate skills into skills and spells
        data.skills = data.allSkills.filter(function(item) {return item.data.isSpell == false});
        data.spells = data.allSkills.filter(function(item) {return item.data.isSpell == true});
        
 
        data.actor.data.ownedSkillList = this._getOwnedSkills(data);
        //gather up the traits
        data.allTraits = data.items.filter(function(item) {return item.type == "trait"});
        //console.log(data.allTraits);
        //separate into Cultures, Languages, Advantages, Disadvantages, Quirks and Perks
        data.advantages = data.allTraits.filter(function (item) {return item.data.traitType == "traitAdvantage"});
        //console.log(data.advantages);
        data.perks = data.allTraits.filter(function(item) {return item.data.traitType == "traitPerk"});
        //console.log(data.perks);
        data.disadvantages = data.allTraits.filter(function(item) {return item.data.traitType == "traitDisadvantage"});
        //console.log(data.disadvantages);
        data.quirks = data.allTraits.filter(function(item) {return item.data.traitType == "traitQuirk"});
        //console.log(data.quirks);
        data.cultures = data.allTraits.filter(function(item){return item.data.traitType == "traitCulture"});
        //console.log(data.cultures);
        data.languages = data.allTraits.filter(function(item){return item.data.traitType == "traitLanguage"});
        //console.log(data.languages);
        
        //gather up the templates
        data.charTemplates = data.items.filter(function(item) {return item.type == "template"});
        
        //calculate Basic Lift
        data.actor.data.basicLift = this._basicLift(data.actor);
        
        //calculate Basic Speed
        data.actor.data.baseSpeed = this._basicSpeed(data.actor); 

        //calculate Basic Move
        data.actor.data.basicMove = this._basicMove(data.actor);

        //calculate encumbrance Level
        data.actor.data.encumbrance = this._getEncumbrance(data.actor);
        data.actor.data.encRef = "enc"+data.actor.data.encumbrance;
       // console.log("GURPS 4E |  current enc " + data.actor.data.encRef);

        //calculate current movement
        data.actor.data.move = this._getMove(data.actor);

        //calculate current dodge
        data.actor.data.dodge = this._getDodge(data.actor);

        //TODO calculate current Parry by selected weapon

        //TODO calculate the current block by shield skill

        //gather up favorite items
            // get owned items filtered by the isFav property
            data.favItems = data.items.filter(function(item) {return item.data.isFav == true});
            //console.log(data.items);
            //console.log(data.favItems);
            // sort into weapons, skill, spells, equipment
            data.favWeapons = data.favItems.filter(function(item) {return item.type == "weapon"});
            data.favAllSkills = data.favItems.filter(function(item) {return item.type == "skill"});
            data.favSkills = data.favAllSkills.filter(function(item) {return item.data.isSpell == false});
            data.favSpells = data.favAllSkills.filter(function(item) {return item.data.isSpell == true});
            data.favEquip = data.favItems.filter(function(item) {return item.type == "equipment"});
            // that should do it

        //lookup the base damage
        this._getBaseDamage(data.actor);

        //console.log(data.weapons[0].data);
        //console.log(data.weapons.length + " items are weapons");     
         for (let n = 0; n < data.weapons.length; n++) {
            const element = data.weapons[n];
            const dataset = element.data;
            //console.log(" weight :" + n + " is " + element.data.weight);
        } 
  
        return data;
    }


    activateListeners(html){

        if(this.isEditable) {}

        if(this.actor.owner){}
        //roll item from actor sheet
        html.find('.rollable').click(this._onRoll.bind(this));

        //create a new item on the actor sheet
        html.find('.item-create').click(this._onItemCreate.bind(this));

        //edit an owned item
        html.find('.item-edit').click(this._onItemEdit.bind(this));

        //delete an owned item
        html.find('.item-delete').click(this._onItemDelete.bind(this));

        //update a field on an owned item
        html.find('.inline-edit').change(this._onInlineEdit.bind(this));

        // Item summaries
        html.find('.item-detail').click(event => this._onItemSummary(event));

        // set favorites
        html.find('.item-favorite').click(this._onItemFavorite.bind(this));

        //equip an equipable item
        html.find('.item-equip').click(this._onItemEquip.bind(this));


        super.activateListeners(html);
        //console.log("*-* activated listener");


    }

    _getDodge(actor){
        let enc = actor.data.encumbrance;
        let d = Math.round(actor.data.baseSpeed)+3;
        if (enc == 0){
            return d;
        } else if (enc == 1){
            return d-1;
        } else if (enc == 2){
            return d-2;
        } else if (enc == 3){
            return d-3;
        } else if (enc == 4){
            return d-4;
        } else {
            console.log("GURPS 4E |  Error: Enchumbrance out of range");
        }
    }

    _getMove(actor){
        let enc = actor.data.encumbrance;
        let bm = actor.data.basicMove;
        if (enc == 0){
            return bm;
        } else if (enc == 1){
            return Math.round(bm*.8);
        } else if (enc == 2) {
            return Math.round(bm*.6);
        } else if (enc == 3) {
            return Math.round(bm*.4);
        } else if (enc == 4){
            return Math.round(bm*.2);
        } else {
            console.log("GURPS 4E |  Error: Enchumbrance out of range");
        }
    }

    _getEncumbrance(actor){
        let bl = actor.data.basicLift;
        let tw = actor.data.totalweight;
       

        if(tw <= bl){
            return 0;
        } else if (tw <= bl*2){
            return 1;
        } else if (tw <= bl*3){
            return 2;
        } else if (tw <= bl*6){
            return 3;
        } else {
            return 4;
        }
        
        

    }

    _getOwnedSkills(data){
        const attributeList = ["ST", "DX", "IQ", "HT", "Will", "Per"];
        let skillList = duplicate(attributeList);
        for(let n = 0; n<data.skills.length; n++){

            let skillName = data.skills[n].name;

            let newskillList = skillList.push(skillName);
        }
        return skillList;
    }

    _basicMove(actor){
        let points = (actor.data.movePoints);
        //console.log(points);
        let moveMod = (points/5);
       // console.log(moveMod);
        let move = Math.floor(actor.data.baseSpeed)+moveMod;
        return move;
    }

    _basicSpeed(actor){
        let points = (actor.data.speedPoints);
        //console.log(points);
        let speedMod = (points/5)*.25;
        //console.log(speedMod);
        let speed = ((actor.data.HT.value+actor.data.DX.value)/4)+speedMod;
        //console.log(speed);
        return speed;
    }

    _basicLift(actor){
        
        let lift = Math.round((actor.data.ST.value*actor.data.ST.value)/5)
        //console.log(lift);
        return lift;
    }

    _onItemSummary(event){
        event.preventDefault();
        let li=$(event.currentTarget).parents(".item"),
        item = this.actor.getOwnedItem(li.data("itemid")),
        chatData = item.getChatData({secrets: this.actor.owner});

        if(chatData.description.value === null){
            return;
        } else if (li.hasClass("expanded")){
            let summary = li.children(".item-summary");
            summary.slideUp(200, () => summary.remove());
        } else {
            let div = $(`<div class="item-summary">${chatData.description.value}</div>`);
            let props = $(`<div class="item-properties"></div>`);
            chatData.properties.forEach(p=> props.append(`<span class="tag">${p}</span>`));
            
            div.append(props);
            li.append(div.hide());
            div.slideDown(200);
        }
        li.toggleClass("expanded");
    }

    _onItemEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        //console.log("***---***" + itemId);
        let item = this.actor.getOwnedItem(itemId);

        item.sheet.render(true);
    }

    _onInlineEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        //console.log("***---***" + itemId);
        let item = this.actor.getOwnedItem(itemId);
        let field = element.dataset.field;

        return item.update({ [field]: element.value});
    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;
        let spellBool = element.dataset.spell;
        let traitType = element.dataset.trait;
        let itemData = {};
        if (element.dataset.type == "trait"){
            //console.log("trait");
            //console.log(element.dataset.trait);
            itemData={
                name: game.i18n.localize("sjgurps4e.sheet.addTrait"),
                type: element.dataset.type,
                "data.traitType": traitType
            }
            
        } else if (spellBool == "spell"){
            itemData={
                name: game.i18n.localize("sjgurps4e.sheet.newSpell"),
                type: element.dataset.type,
                "data.isSpell": true
            };
        } else {
        itemData = {
            name: game.i18n.localize("sjgurps4e.sheet.newItem"),
            type: element.dataset.type
        };
        }
        return this.actor.createOwnedItem(itemData);
    }

    _onItemDelete(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        //console.log("***---***" + itemId);
        return this.actor.deleteOwnedItem(itemId);
    }

    _onItemFavorite(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        
        //console.log(itemId);
        //console.log("GURPS 4e | current status of Fav: " + item.data.data.isFav);
        //console.log("GURPS 4e | yes on favorite toggle");
        //console.log(item.data.data.isFav);
        if(item.data.data.isFav){
            item.data.data.isFav = false;
            item.update({ "data.isFav" : false});
        } else {
            item.data.data.isFav = true;
            item.update({ "data.isFav" : true});
        }
        
       // console.log("GURPS 4e | current status of Fav: " + item.data.data.isFav);
        //console.log(item);


    }

    _onItemEquip(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);

        if(item.data.data.equiped){
            item.data.data.equiped = false;
            item.update({"data.equiped" : false});

        }else {
            item.data.data.equiped = true;
            item.update({ "data.equiped" : true});
        }
    }

    async _onRoll(event){
       
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        let baseTarget = 0;
        let modifier = 0;
        let skillUsedName = '';
        let damageFormulas = [];
        let damageType = [];
        let baseType =[];
        let isweapon = false;
        let hasDamage = false;
        let chatDesc ='';
        
        /** find out what kind of thing we are rolling on
        // items, skills, spells, stats etc.
        // then set up the correct roll for that thing
        */ 

        let itemId = '';
        //for stats just pass the formula and target and roll
        if (dataset.source == "stat"){        
            baseTarget = Number(dataset.target) 
        } else if (dataset.source == 'item'){
            //weapons and tools should get the applicable skill
            itemId = element.closest(".item").dataset.itemid;
            let item = this.actor.getOwnedItem(itemId);
            chatDesc = item.data.data.description.value;
            if(item.data.data.itemType == "weaponMelee" || item.data.data.itemType == "weaponRanged"){
                isweapon = true;
                hasDamage = true;
                let damage = item.data.data.damage;
                for(let n=0; n<damage.parts.length; n++){
                    let currentParts = damage.parts[n];
                    if(currentParts[0] == "swing"){
                        damageFormulas[n] = this.actor.data.data.damageSw + "+" + currentParts[1];
                        damageType[n] = currentParts[2];
                        baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.swDamage");
                    } else if (currentParts[0] == "thrust"){
                        damageFormulas[n] = this.actor.data.data.damageThr + "+" + currentParts[1];
                        damageType[n] = currentParts[2];
                        baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.thrDamage");
                    } else if (currentParts[0] == "die"){
                        damageFormulas[n] = currentParts[1];
                        damageType[n] = currentParts[2];
                        baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.rDamage");
                    } else if (currentParts[0] == "spec"){
                        damageFormulas[n] = '';
                        damageType[n] = game.i18n.localize("sjgurps4e.damageType.spec");
                        baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.specDamage");
                    }
                }
            }

            // get the skill mod of the item we clicked 
            let skillMod = item.data.data.skillMod;
            let skillUsedNumber = item.data.data.skillUsed;
            // stats are <=5 skills are >=6
            if(skillUsedNumber <=5){
                // --- we are using a stat default not a skill so get the stat value
                // stats are ordered as follows ST, DX, IQ, HT, Will, Per 
                switch (Number(skillUsedNumber)){
                    case 0:
                        baseTarget = this.actor.data.data.ST.value;
                        modifier = skillMod;
                        break;
                    case 1:
                        baseTarget = this.actor.data.data.DX.value;
                        modifier = skillMod;
                        break;
                    case 2:
                        baseTarget = this.actor.data.data.IQ.value;
                        modifier = skillMod;
                        break;
                    case 3: 
                        baseTarget = this.actor.data.data.HT.value;
                        modifier = skillMod;
                        break;
                    case 4:
                        baseTarget = this.actor.data.data.Will.value;
                        modifier =  skillMod;
                        break;
                    case 5:
                        baseTarget = this.actor.data.data.Per.value;
                        modifier= skillMod;
                        break;
                }

            } else {
                // --- we have a skill selected to be used by the item
                
                let data = this.getData();
                let skillList = data.actor.data.ownedSkillList;
                let skillLevel = 0;
                let skillName = skillList[skillUsedNumber];
                let allSkills = this.actor.data.items.filter(function(item) {return item.type == "skill"}); 
                let itemSkills = allSkills.filter(function(item) {return item.data.isSpell == false});
                itemSkills.forEach(element => {
                    if (element.name === skillName) {
                        skillLevel = element.data.level;
                        let stat = element.data.stat;
                        let difficulty = element.data.difficulty;
                        let effectiveTarget = this._getSkillTarget(skillLevel, stat, difficulty);
                        baseTarget = effectiveTarget;
                        modifier = skillMod;
                        skillUsedName = skillName;
                    }

                });
            }

        } else if (dataset.source == 'skill'){
            // clicking to roll a skill should get the skill target 
            // for this we need the skill, its level, its stat and its difficulty
            
            itemId = element.closest(".item").dataset.itemid;
            let item = this.actor.getOwnedItem(itemId);
            let effectiveTarget = this._getSkillTarget(item.data.data.level, item.data.data.stat, item.data.data.difficulty);
            baseTarget = effectiveTarget;
            chatDesc = item.data.data.description.value;
            console.log(item);
            if(item.data.data.isSpell){
                //check to see if this spell does damage
                //if so set the damage flag to true and 
                //parse out the damage roll formula... 
                // need to think about how to handle missile spells
               
                if(item.data.data.hasDamage){
                    hasDamage = true;
                    let damage = item.data.data.damage;
                    for(let n=0; n<damage.parts.length; n++){
                        let currentParts = damage.parts[n];
                        if(currentParts[0] == "swing"){
                            damageFormulas[n] = this.actor.data.data.damageSw + "+" + currentParts[1];
                            damageType[n] = currentParts[2];
                            baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.swDamage");
                        } else if (currentParts[0] == "thrust"){
                            damageFormulas[n] = this.actor.data.data.damageThr + "+" + currentParts[1];
                            damageType[n] = currentParts[2];
                            baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.thrDamage");
                        } else if (currentParts[0] == "die"){
                            damageFormulas[n] = currentParts[1];
                            damageType[n] = currentParts[2];
                            baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.rDamage");
                        } else if (currentParts[0] == "spec"){
                            damageFormulas[n] = '';
                            damageType[n] = game.i18n.localize("sjgurps4e.damageType.spec");
                            baseType[n] = game.i18n.localize("sjgurps4e.itemProperties.specDamage");
                        }
                    }

                }

            }
        } else if (dataset.source == 'dodge'){
            baseTarget = Number(dataset.target); 
        } else if (dataset.source == 'parry'){
            baseTarget =Number(dataset.target);
        } else if (dataset.source == 'block'){
            baseTarget =Number(dataset.target);
        }
        

        // Now do the roll and create the chat message
        let mRoll = new Roll(dataset.roll, this.actor.data.data);
        mRoll.evaluate();
        let rollValue = mRoll.total;
        let rollTooltip = await Promise.resolve(mRoll.getTooltip());
        //set up variables for modified and unmodified rolls
        let margin = 0;
        let isCritSuccess = false;
        let isCritFail = false;
        
        let sucessLabel = game.i18n.localize("sjgurps4e.sheet.failBy");
        let cssResult = "fail-result";
        let difficutFlavor = function (modedTarget) {if (modedTarget<5){return game.i18n.localize("sjgurps4e.sheet.4orUnder")}else{return modedTarget}};
        let isSuccess = false;

        // check event for alt key which we will use to set the modifier data
        if(event.altKey){
                let modPromise = this.actor.data.data.rmod;
                modifier =  Number(modifier) + Number(modPromise);
                let modedTarget = Number(baseTarget) + Number(modifier);
                if (modedTarget < 5 ){
                    modedTarget = 4;
                }
                margin = modedTarget - rollValue;
                //determine success, failure or crit status
                if(rollValue <= modedTarget || rollValue <=4 && rollValue < 17){
                    isSuccess = true;
                    sucessLabel = game.i18n.localize("sjgurps4e.sheet.successBy");
                    cssResult = "sucess-result";
                    if(modedTarget >= 16 && rollValue <= 6 ){
                        isCritSuccess = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSuccessBy");
                    } else if (modedTarget >= 15 && rollValue <= 5){
                        isCritSuccess = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSuccessBy");
                    } else if (rollValue <= 4){
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSuccessBy");
                        isCritSuccess = true;
                    }
                } else {
                    isSuccess = false;
                    sucessLabel = game.i18n.localize("sjgurps4e.sheet.failBy");
                    cssResult = "fail-result";
                    if(rollValue == 18){
                        isCritFail = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                    } else if (modedTarget <= 15 && rollValue == 17){
                        isCritFail = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                    } else if (rollValue >= modedTarget+10){
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                        isCritFail = true;
                    }
                }
                
                if(skillUsedName != ''){
                    let label = dataset.label ? 
                    `<span class="flavor-text">
                        <div class="chat-header flexrow">
                            <img class="portrait" width="48" height="41.5" src="` +this.actor.data.img+ `"/>
                            <h1>${dataset.label} </h1>
                        </div>
                        <div class="skill-info-chat flexrow">
                            <div class="skillname">Using ` + skillUsedName + ` Skill</div>
                            <div class="sep">|</div>
                            <div>`+ game.i18n.localize("sjgurps4e.sheet.targetIs")  + difficutFlavor(modedTarget) +`</div>
                        </div>
                        <div class="use-desc">` + chatDesc + 
                        `</div>
                        <div class="result-text `+cssResult+`">` + sucessLabel + Math.abs(margin) +`</div></span>`  : '';
                    
                    let flavorText = label + `
                    <div class="dice-roll">
                        <div class="dice-result">
                            <div class="dice-formula">`+mRoll._formula+`</div>`
                            +rollTooltip+`<h4 class="dice-total">`+mRoll.total+`</h4></div></div>`;

                    let damageText = "";
                    if(hasDamage){
                        for(let n = 0; n<damageFormulas.length; n++){
                            let damageRoll = new Roll(damageFormulas[n], this.actor.data.data);
                            damageRoll.evaluate();
                            rollValue = damageRoll.total;
                            rollTooltip = await Promise.resolve(damageRoll.getTooltip());
                            damageText = damageText+ `<div class="flexrow"><div>` + baseType[n] + `</div>
                            <div> ` + game.i18n.localize("sjgurps4e.damageType."+damageType[n]) + `</div></div> 
                            <div class="dice-roll">
                            <div class="dice-result">
                            <div class="dice-formula">`+damageRoll._formula+`</div>`
                            +rollTooltip+`<h4 class="dice-total">`+damageRoll.total+`</h4></div></div>`  ; 
                        }
                            
                    }
                    flavorText = flavorText + damageText;   
                    // chat message for sucess and by amount flagging crits 
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor, token: this.actor.img }),
                        content: flavorText,
                        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                        sound: "",
                        isRoll: true,
                        roll: mRoll
                    });
                } else {
                    let label = dataset.label ? 
                        `<span class="flavor-text"><div class="chat-header flexrow">
                            <img class="portrait" width="48" height="41.5"  src="` +this.actor.img+ `"/>
                            <h1>${dataset.label} </h1>
                        </div>
                        <div class="skill-info-chat flexrow"> 
                        `+ game.i18n.localize("sjgurps4e.sheet.targetIs")  + difficutFlavor(modedTarget)  + `
                        </div>
                        <div class="use-desc">` + chatDesc + `</div>
                        <div class="result-text `+cssResult+`">` + sucessLabel + Math.abs(margin) +`</div></span>`  : '';
                    
                        let flavorText = label + `
                        <div class="dice-roll">
                            <div class="dice-result">
                            <div class="dice-formula">`+mRoll._formula+`</div>`
                            +rollTooltip+`<h4 class="dice-total">`+mRoll.total+`</h4></div></div>`;
                        let damageText = "";
                        if(hasDamage){
                            for(let n = 0; n<damageFormulas.length; n++){
                                let damageRoll = new Roll(damageFormulas[n], this.actor.data.data);
                                damageRoll.evaluate();
                                rollValue = damageRoll.total;
                                rollTooltip = await Promise.resolve(damageRoll.getTooltip());
                                damageText = damageText+ `<div class="flexrow"><div>` + baseType[n] + `</div>
                                <div> ` + game.i18n.localize("sjgurps4e.damageType."+damageType[n]) + `</div></div> 
                                <div class="dice-roll">
                                <div class="dice-result">
                                <div class="dice-formula">`+damageRoll._formula+`</div>`
                                +rollTooltip+`<h4 class="dice-total">`+damageRoll.total+`</h4></div></div>`  ; 
                            }
                                
                        }
                        flavorText = flavorText + damageText;   
                        // chat message for sucess and by amount flagging crits 
                        ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor, token: this.actor.img }),
                        content: flavorText,
                        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                        sound: "",
                        isRoll: true,
                        roll: mRoll
                    });
                    
                }

        } else {
            // No modifier applied        
            
                let modedTarget = Number(baseTarget) + Number(modifier);
                if (modedTarget < 5 ){
                    modedTarget = 4;
                }
                margin = modedTarget - rollValue;
                //determine success, failure or crit status
                if(rollValue <= modedTarget || rollValue <=4 && rollValue < 17){
                    isSuccess = true;
                    sucessLabel = game.i18n.localize("sjgurps4e.sheet.successBy");
                    cssResult = "sucess-result";
                    if(modedTarget >= 16 && rollValue <= 6 ){
                        isCritSuccess = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSucessBy");
                    } else if (modedTarget >= 15 && rollValue <= 5){
                        isCritSuccess = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSucessBy");
                    } else if (rollValue <= 4){
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critSucessBy");
                        isCritSuccess = true;
                    }
                } else {
                    isSuccess = false;
                    sucessLabel = game.i18n.localize("sjgurps4e.sheet.failBy");
                    cssResult = "fail-result";
                    if(rollValue == 18){
                        isCritFail = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                    } else if (modedTarget <= 15 && rollValue == 17){
                        isCritFail = true;
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                    } else if (rollValue >= modedTarget+10){
                        sucessLabel = game.i18n.localize("sjgurps4e.sheet.critFailBy");
                        isCritFail = true;
                    }
                }
                // set up chat message.  note if that dataset.label is null we make the string empty
                if(skillUsedName != ''){
                    let label = dataset.label ? 
                    `<span class="flavor-text">
                        <div class="chat-header flexrow">
                            <img class="portrait" width="48" height="41.5" src="` +this.actor.data.img+ `"/>
                            <h1>${dataset.label} </h1>
                        </div>
                        <div class="skill-info-chat flexrow">
                            <div class="skillname">`+game.i18n.localize("sjgurps4e.sheet.using") + skillUsedName + game.i18n.localize("sjgurps4e.skill")+`</div>
                            <div class="sep">|</div>
                            <div>` + game.i18n.localize("sjgurps4e.sheet.targetIs") + difficutFlavor(modedTarget) +`</div>
                        </div>
                        <div class="use-desc">` + chatDesc + 
                        `</div>
                        <div class="result-text `+cssResult+`">` + sucessLabel + Math.abs(margin) +`</div></span>`  : '';
                    
                    let flavorText = label + `
                    <div class="dice-roll">
                        <div class="dice-result">
                            <div class="dice-formula">`+mRoll._formula+`</div>`
                            +rollTooltip+`<h4 class="dice-total">`+mRoll.total+`</h4></div></div>`;

                    let damageText = "";
                    if(hasDamage){
                        for(let n = 0; n<damageFormulas.length; n++){
                            let damageRoll = new Roll(damageFormulas[n], this.actor.data.data);
                            damageRoll.evaluate();
                            rollValue = damageRoll.total;
                            rollTooltip = await Promise.resolve(damageRoll.getTooltip());
                            damageText = damageText+ `<div class="flexrow"><div>` + baseType[n] + `</div>
                            <div> ` + game.i18n.localize("sjgurps4e.damageType."+damageType[n]) + `</div></div> 
                            <div class="dice-roll">
                            <div class="dice-result">
                            <div class="dice-formula">`+damageRoll._formula+`</div>`
                            +rollTooltip+`<h4 class="dice-total">`+damageRoll.total+`</h4></div></div>`  ; 
                        }
                            
                    }
                    flavorText = flavorText + damageText;   
                    
                            // chat message for sucess and by amount flagging crits 
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor, token: this.actor.img }),
                        content: flavorText,
                        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                        sound: "",
                        isRoll: true,
                        roll: mRoll
                    });
                    // damage rolls... should replace with buttons to roll

                    if(!hasDamage){
                        for(let n=0; n<damageFormulas.length;n++){
                            mRoll = new Roll(damageFormulas[n], this.actor.data.data);
                            label = `<div class=flexrow><div>` + baseType[n] + `</div>
                            <div> ` + damageType[n] + `</div></div>`; 
                            mRoll.roll().toMessage({
                                speaker:ChatMessage.getSpeaker({actor: this.actor}),
                                flavor: label
                            });
                        }
                    }
                } else {
                    let label = dataset.label ? 
                        `<span class="flavor-text"><div class="chat-header flexrow">
                            <img class="portrait" width="48" height="41.5"  src="` +this.actor.img+ `"/>
                            <h1>${dataset.label} </h1>
                        </div>
                        <div class="skill-info-chat flexrow"> 
                        ` + game.i18n.localize("sjgurps4e.sheet.targetIs") + difficutFlavor(modedTarget)  + `
                        </div>
                        <div class="use-desc">` + chatDesc + `</div>
                        <div class="result-text `+cssResult+`">` + sucessLabel + Math.abs(margin) +`</div></span>`  : '';

                        let flavorText = label + `
                        <div class="dice-roll">
                            <div class="dice-result">
                                <div class="dice-formula">`+mRoll._formula+`</div>`
                                +rollTooltip+`<h4 class="dice-total">`+mRoll.total+`</h4></div></div>`;
                        let damageText = "";
                            if(hasDamage){
                                for(let n = 0; n<damageFormulas.length; n++){
                                    let damageRoll = new Roll(damageFormulas[n], this.actor.data.data);
                                    damageRoll.evaluate();
                                    rollValue = damageRoll.total;
                                    rollTooltip = await Promise.resolve(damageRoll.getTooltip());
                                    damageText = damageText+ `<div class="flexrow"><div>` + baseType[n] + `</div>
                                    <div> ` + game.i18n.localize("sjgurps4e.damageType."+damageType[n]) + `</div></div> 
                                    <div class="dice-roll">
                                    <div class="dice-result">
                                    <div class="dice-formula">`+damageRoll._formula+`</div>`
                                    +rollTooltip+`<h4 class="dice-total">`+damageRoll.total+`</h4></div></div>`  ; 
                                }
                                    
                            }
                        flavorText = flavorText + damageText;    
                        // chat message for sucess and by amount flagging crits 
                        ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor, token: this.actor.img }),
                        content: flavorText,
                        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                        sound: "",
                        isRoll: true,
                        roll: mRoll
                    });

                    if(!hasDamage){
                        for(let n=0; n<damageFormulas.length;n++){
                            mRoll = new Roll(damageFormulas[n], this.actor.data.data);
                            label = `<div class=flexrow><div>` + baseType[n] + `</div>
                            <div> ` + damageType[n] + `</div></div>`; 
                            mRoll.roll().toMessage({
                                speaker:ChatMessage.getSpeaker({actor: this.actor}),
                                flavor: label
                            });
                        }
                    }
                }

                
        }
    }

    _getBaseDamage(actor) {

        //lookup the base damage
    /*         ST Thrust Swing  ST Thrust Swing
    1 1d-6   1d-5   27  3d-1  5d+1
    2 1d-6   1d-5   28  3d-1  5d+1
    3 1d-5   1d-4   29  3d    5d+2
    4 1d-5   1d-4   30  3d    5d+2
    5 1d-4   1d-3   31  3d+1  6d-1
    6 1d-4   1d-3   32  3d+1  6d-1
    7 1d-3   1d-2   33  3d+2  6d
    8 1d-3   1d-2   34  3d+2  6d
    9 1d-2   1d-1   35  4d-1  6d+1
    10 1d-2  1d     36  4d-1  6d+1
    11 1d-1  1d+1   37  4d    6d+2
    12 1d-1  1d+2   38  4d    6d+2
    13 1d    2d-1   39  4d+1  7d-1
    14 1d    2d     40  4d+1  7d-1
    15 1d+1  2d+1   45  5d    7d+1
    16 1d+1  2d+2   50  5d+2  8d-1
    17 1d+2  3d-1   55  6d    8d+1
    18 1d+2  3d     60  7d-1  9d
    19 2d-1  3d+1   65  7d+1  9d+2
    20 2d-1  3d+2   70  8d    10d
    21 2d    4d-1   75  8d+2  10d+2
    22 2d    4d     80  9d    11d
    23 2d+1  4d+1   85  9d+2  11d+2
    24 2d+1  4d+2   90  10d   12d
    25 2d+2  5d-1   95  10d+2 12d+2
    26 2d+2  5d     100 11d   13d 
    
    */
    
    switch(actor.data.ST.value){
        case 1:
        case 2:
            actor.data.damageThr = "1d6-6";
            actor.data.damageSw = "1d6-5";
            break;
        case 3:
        case 4:
            actor.data.damageThr = "1d6-5";
            actor.data.damageSw = "1d6-4";
            break;
        case 5:
        case 6:
            actor.data.damageThr = "1d6-4";
            actor.data.damageSw = "1d6-3";
            break;
        case 7:
            actor.data.damageThr = "1d6-3";
            actor.data.damageSw = "1d6-2";
            break;
        case 8:
            actor.data.damageThr = "1d6-4";
            actor.data.damageSw = "1d6-2";
            break;
        case 9:
            actor.data.damageThr = "1d6-2";
            actor.data.damageSw = "1d6-1";
            break;
        case 10:
            actor.data.damageThr = "1d6-2";
            actor.data.damageSw = "1d6";
            break;
        case 11:
            actor.data.damageThr = "1d6-1";
            actor.data.damageSw = "1d6+1";
            break;
        case 12:
            actor.data.damageThr = "1d6-1";
            actor.data.damageSw = "1d6+2";
            break;
        case 13:
            actor.data.damageThr = "1d6";
            actor.data.damageSw = "2d6-1";
            break;
        case 14:
            actor.data.damageThr = "1d6";
            actor.data.damageSw = "2d6";
            break;
        case 15:
            actor.data.damageThr = "1d6+1";
            actor.data.damageSw = "2d6+1";
            break;
        case 16:
            actor.data.damageThr = "1d6+1";
            actor.data.damageSw = "2d6+2";
            break;
        case 17:
            actor.data.damageThr = "1d6+2";
            actor.data.damageSw = "3d6-1";
            break;
        case 18:
            actor.data.damageThr = "1d6+2";
            actor.data.damageSw = "3d6";
            break;
        case 19:
            actor.data.damageThr = "2d6-1";
            actor.data.damageSw = "3d6+1";
            break;
        case 20:
            actor.data.damageThr = "2d6-1";
            actor.data.damageSw = "3d6+2";
            break;
        case 21:
            actor.data.damageThr = "2d6";
            actor.data.damageSw = "4d6-1";
            break;
        case 22:
            actor.data.damageThr = "2d6";
            actor.data.damageSw = "4d6";
            break;
        case 23:
            actor.data.damageThr = "2d6+1";
            actor.data.damageSw = "4d6+1";
            break;
        case 24:
            actor.data.damageThr = "2d6+1";
            actor.data.damageSw = "4d6+2";
            break;
        case 25:
            actor.data.damageThr = "2d6+2";
            actor.data.damageSw = "5d6-1";
            break;
        case 26:
            actor.data.damageThr = "2d6+2";
            actor.data.damageSw = "5d6";
            break;
        case 27:
        case 28:
            actor.data.damageThr = "3d6-1";
            actor.data.damageSw = "5d6+1";
            break;
        case 29:
        case 30:
            actor.data.damageThr = "3d6";
            actor.data.damageSw = "5d6+2";
            break;
        case 31:
        case 32:
            actor.data.damageThr = "3d6+1";
            actor.data.damageSw = "6d6-1";
            break;
        case 33:
        case 34:
            actor.data.damageThr = "3d6+2";
            actor.data.damageSw = "6d6";
            break;
        case 35:
        case 36:
            actor.data.damageThr = "4d6-1";
            actor.data.damageSw = "6d6+1";
            break;
        case 37:
        case 38:
            actor.data.damageThr = "4d6";
            actor.data.damageSw = "6d6+2";
            break;
        case 39:
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
            actor.data.damageThr = "4d6+1";
            actor.data.damageSw = "7d6-1";
            break;
        case 45:
        case 46:
        case 47:
        case 48:
        case 49:
            actor.data.damageThr = "5d6";
            actor.data.damageSw = "7d6+1";
            break;
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
            actor.data.damageThr = "5d6+2";
            actor.data.damageSw = "8d6-1";
            break;
        case 55:
        case 56:
        case 57:
        case 58:
        case 59:
            actor.data.damageThr = "6d6";
            actor.data.damageSw = "8d6+1";
            break;
        case 60:
        case 61:
        case 62:
        case 63:
        case 64:
            actor.data.damageThr = "7d6-1";
            actor.data.damageSw = "9d6";
            break;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
            actor.data.damageThr = "7d6+1";
            actor.data.damageSw = "9d6+2";
            break;
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
            actor.data.damageThr = "8d6";
            actor.data.damageSw = "10d6";
            break;
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
            actor.data.damageThr = "8d6+2";
            actor.data.damageSw = "10d6+2";
            break;
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
            actor.data.damageThr = "9d6";
            actor.data.damageSw = "11d6";
            break;
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
            actor.data.damageThr = "9d6+2";
            actor.data.damageSw = "11d6+2";
            break;
        case 90:
        case 91:
        case 92:
        case 93:
        case 94:
            actor.data.damageThr = "10d6";
            actor.data.damageSw = "12d6";
            break;
        case 95:
        case 96:
        case 97:
        case 98:
        case 99:
            actor.data.damageThr = "10d6+2";
            actor.data.damageSw = "12d6+2";
            break;
        case 100:
            actor.data.damageThr = "11d6";
            actor.data.damageSw = "13d6";                
    }
    
    //console.log(actor.data.damageSw);
    //console.log(actor.data.damageThr);
    
    
    }

    _getSkillTarget(skillLevel, stat, difficulty){
        const data = this.getData();
        let statValue = 10;
        //console.log(stat);
        if(difficulty === "EZ"){
            
            let statMod = skillLevel-1
            // get the current stat
            
            switch(stat) {
                case "ST":
                    statValue = data.actor.data.ST.value;
                    break;
                case "DX":
                    statValue = data.actor.data.DX.value;
                    break;
                case "IQ":
                    statValue = data.actor.data.IQ.value;
                    break;
                case "Will":
                    statValue = data.actor.data.Will.value;
                    break;
                case "Per":
                    statValue = data.actor.data.Per.value;
                    break;
            }
           
           
            return Number(statValue)+Number(statMod);

        }else if  (difficulty === "AV"){
            let statMod = Number(skillLevel)-2;
            // get the current stat
            
            switch(stat) {
                case "ST":
                    statValue = data.actor.data.ST.value;
                    break;
                case "DX":
                    statValue = data.actor.data.DX.value;
                    break;
                case "IQ":
                    statValue = data.actor.data.IQ.value;
                    break;
                case "Will":
                    statValue = data.actor.data.Will.value;
                    break;
                case "Per":
                    statValue = data.actor.data.Per.value;
                    break;
            }
            
            return Number(statValue)+Number(statMod);


        }else if (difficulty === "HD"){
            let statMod = skillLevel-3
            // get the current stat
        
            switch(stat) {
                case "ST":
                    statValue = data.actor.data.ST.value;
                    break;
                case "DX":
                    statValue = data.actor.data.DX.value;
                    break;
                case "IQ":
                    statValue = data.actor.data.IQ.value;
                    break;
                case "Will":
                    statValue = data.actor.data.Will.value;
                    break;
                case "Per":
                    statValue = data.actor.data.Per.value;
                    break;
            }
            
            return Number(statValue)+Number(statMod);



        }else if (difficulty === "VH"){
            let statMod = skillLevel-4
            // get the current stat
         
            switch(stat) {
                case "ST":
                    statValue = data.actor.data.ST.value;
                    break;
                case "DX":
                    statValue = data.actor.data.DX.value;
                    break;
                case "IQ":
                    statValue = data.actor.data.IQ.value;
                    break;
                case "Will":
                    statValue = data.actor.data.Will.value;
                    break;
                case "Per":
                    statValue = data.actor.data.Per.value;
                    break;
            }
            
            return Number(statValue)+Number(statMod);
        }

    }

  
}

async function getModifier(dialogData) {
    let modifier = 0;
    let template = "systems/sjgurps4e/templates/chat/roll-dialog.html";
    const html = await renderTemplate(template, dialogData)
    let applyChange = false;
        new Dialog({
            title: "Modify Target Value",
            content: html,
            buttons: {
                submit: {
                    icon: "<i class='fas fa-check'></i>",
                            label: "Submit",
                            callback: () => applyChange = true
                            
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: `Cancel`
                },
            },
            defauly: "submit",
            close: html => {
                if (applyChange) {
                    console.log("set the mod :" + html.find('[name="modifier"]')[0].value);
                    modifier += html.find('[name="modifier"]')[0].value;
                }
            }
        }).render(true);
        //setTimeout(function() { document.getElementById("roll-mod").focus(); }, 10);
   
    return  new Promise((resoveFunc, rejectionFunc) => {
        resoveFunc(modifier);

    });

}
            


