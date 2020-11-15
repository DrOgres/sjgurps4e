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

        //gather up the skill items  -- we need to peel off spells?
        data.skills = data.items.filter(function(item) {return item.type == "skill"});        
        
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

        let itemData = {
            name: game.i18n.localize("sjgurps4e.sheet.newItem"),
            type: element.dataset.type
        };
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
            console.log("alt modifier: " + modifier);
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


}

async function getModifier() {
            
            let modifier=0;
            // if user presed that while clicking show a dialog to ask for modifier and or skill
            // then pass the changes from that form to the overall roll 
            console.log("alt pressed");
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

