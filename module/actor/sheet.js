export default class GURPS4eCharacterSheet extends ActorSheet {
   
   
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sjgurps4e/templates/actors/actor-sheet.hbs",
            classes: ["sjgurps4e", "sheet", "actor", "character"],
            scrollY: [".tab.core"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "core"}]
        });
    }

    get template() {
        const path = "systems/sjgurps4e/templates/actors";
        return `${path}/${this.actor.data.type}.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.sjgurps4e;

        // gather up the weapon items
        data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
        
        //gather up the eqipment items
        data.equips = data.items.filter(function(item) {return item.type == "equipment"});

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
        //separate skills into skills and spells
        data.skills = data.allSkills.filter(function(item) {return item.data.isSpell == false});
        data.spells = data.allSkills.filter(function(item) {return item.data.isSpell == true});
        
 
        data.actor.data.ownedSkillList = this._getOwnedSkills(data);
      
        //gather up the traits
        data.allTraits = data.items.filter(function(item) {return item.type == "trait"});

        //separate into Advantages, Disadvantages, Quirks and Perks

        //gather up the templates
        data.charTemplates = data.items.filter(function(item) {return item.type == "template"});

        
        //calculate Basic Lift
        data.actor.data.basicLift = this._basicLift(data.actor);
        
        //calculate Basic Speed
        data.actor.data.baseSpeed = this._basicSpeed(data.actor); 

        //calculate Basic Move
        data.actor.data.basicMove = this._basicMove(data.actor);

        //calculate encumbrance Level

        //calculate current movement

        //lookup the base damage
        this._getBaseDamage(data.actor);

        //console.log(data.weapons[0].data);
        //console.log(data.weapons.length + " items are weapons");     
         for (let n = 0; n < data.weapons.length; n++) {
            const element = data.weapons[n];
            const dataset = element.data;
            //console.log(" weight :" + n + " is " + element.data.weight);
        } 
        //console.log(sheetData.weapons[n].type);
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


        super.activateListeners(html);
        //console.log("*-* activated listener");


    }

    _getOwnedSkills(data){
        console.log("GURPS 4E  |  " + data.skills);
        const attributeList = ["ST", "DX", "IQ", "HT", "Will", "Per"];
        let skillList = duplicate(attributeList);
        for(let n = 0; n<data.skills.length; n++){
        
            console.log("GURPS 4E  |  " + data.skills[n].name);
            
            let skillName = data.skills[n].name;

            let newskillList = skillList.push(skillName);
        }
        
        console.log("GURPS 4E  |  " + skillList);
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
        let itemData = {};
        //console.log(spellBool);
        if (spellBool == "spell"){
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


    _onRoll(event){
       // Show(event);
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        let modifier = 0;
             // check event for alt key
        if(event.altKey){
            modifier = getModifier();
           // console.log("alt modifier: " + modifier);
           /*  if(dataset.roll){
                let roll = new Roll(dataset.roll, this.actor.data.data);
                let label = dataset.label ? `Rolling ${dataset.label}, target is ${moded_roll}` : '';
                roll.roll().toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                    flavor: label
                }); 
                
            }*/

            } else {       
                if(dataset.roll){
                    let modedTarget = Number(dataset.target) + modifier;
                    let roll = new Roll(dataset.roll, this.actor.data.data);
                    let label = dataset.label ? `Rolling ${dataset.label}, target is ` + modedTarget : '';
                    roll.roll().toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                    flavor: label
                    });
                }
            }
    }

    _prepareItems(data) {
        const inventory = {
            weapon: {label: "weapons", items: [], dataset: {type: "weapon"} },
            equipment: { label: "DND5E.ItemTypeEquipmentPl", items: [], dataset: {type: "equipment"} } 
        
        };
        data.inventory = Object.values(inventory);
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


}

async function getModifier() {
            
            let modifier=0;
            // if user presed that while clicking show a dialog to ask for modifier and or skill
            // then pass the changes from that form to the overall roll 
           // console.log("alt pressed");
            let d = new Dialog({
                    title: "Roll Modifiers",
                    content: `
                        <div style='height: 25px; line-height: 25px; font-size: 20px; margin-bottom: 10px; text-align: center;'>
                           Modify Target by: <input id='roll_modifier' name='data.modifier' type='text' style='width: 150px; height: 30px;' value='0' onfocus='this.select()'>
                        </div>`,
                    buttons: {
                        ok:{
                            label: "ok",
                        },
                        cancel:{
                            label: "cancel",
                        }
                    },
                    default: "ok",
                    render: html => console.log("Register interactivity in the rendered dialog"),
                    close: html =>  {   
                                        modifier = html.find('[name="data.modifier"]')[0].value;
                                        console.log("we have set the modifier to "+ html.find('[name="data.modifier"]')[0].value);
                                    }
                });

            d.render(true);
            setTimeout(function() {document.getElementById("roll_modifier").focus();}, 300);
            setTimeout(function(){}, 2000 );
            console.log("got Modifier: " + modifier);
            // expected output: "resolved"
            return modifier;
}

