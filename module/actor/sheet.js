export default class GURPS4eCharacterSheet extends ActorSheet {
   
   
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sjgurps4e/templates/actors/actor-sheet.hbs",
            classes: ["sjgurps4e", "sheet", "character"],
            scrollY: [".tab.details"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "core"}]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.sjgurps4e;
        //console.log(data.attributes.ST.value);
       // data.item = data.types.titleCase();
       // data.weapons = data.items.filter(function(item) {return item.types == "weapon"});
        return data;
    }


    activateListeners(html){
        html.find('.rollable').click(this._onRoll.bind(this));


        super.activateListeners(html);
        //console.log("*-* activated listener");

        if (!this.options.editable) {
            //console.log("*-* editable");
            return;
        }
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
                    let modedTarget = dataset.target + modifier;
                    let roll = new Roll(dataset.roll, this.actor.data.data);
                    let label = dataset.label ? `Rolling ${dataset.label}, target is` + modedTarget : '';
                    roll.roll().toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                    flavor: label
                    });
                }
            }
    }

    


}

async function getModifier() {
            event.preventDefault();
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
            console.log(modifier);
            // expected output: "resolved"
            return modifier;
}

