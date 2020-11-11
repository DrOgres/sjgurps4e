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
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
    
        if(dataset.roll){
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                flavor: label
            });
            
    
        }
    }


}