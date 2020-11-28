
export default class ItemSheetGurps extends ItemSheet{

    constructor(...args) {
        super(...args);
    }


    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            width : 650, 
            height: 350,
            classes: ["sjgurps4e", "sheet", "item"],
            resizable: true,
            scrollY: [".tab.details"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    get template() {
        const path = "systems/sjgurps4e/templates/items";
        return `${path}/${this.item.data.type}.hbs`;
    }

    async getData(options) {
        const data = super.getData(options);
        data.labels = this.item.labels;
        data.config = CONFIG.sjgurps4e;

        //Item Type and details
        data.itemClass = data.item.type.titleCase();
       // console.log(data.itemClass + " itemClass data from itemsheet");        
        data.weaponType = data.item.data.weaponType;
        data.isRangedWeapon = this._isRangedWeapon(data.item);
        data.isSkill = this._isSkill(data.item.type);
        data.isSpell = this.__isSpell(data.item.type);
        data.isLanguage = this._isLanguage(data.item);
        //data.skillUsed = data.item.data.skillUsed;

        //console.log(data.item.data.skillUsed + " item data from itemsheet");
        //console.log(data.item.data.cost);
        //console.log(data.item.data.weight);
        //console.log(data.weaponType);
        //console.log(data.weaponType + " getdata()");
        //console.log(this.item.data.type  + " getdata()");
        //console.log(data.isSkill);
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

    /** if this is a ranged weapon we want to know that so we can use the correct data fields */
    
    _isLanguage(item) {
        const data = item.data;
        console.log(data.traitType); 

        if(data.traitType === "traitLanguage"){
            data.isLanguage = true;
        }

        return data.isLanguage;

    }
    _isRangedWeapon(item) {
        const data = item.data;
        //console.log(data.weaponType + " is ranged weapon");
        //console.log(item.weaponType);
        if(data.itemType === "weaponRanged"){
            data.isRangedWeapon = true;
        }
        return (data.isRangedWeapon);
    }

    _isSkill(type) {
        //console.log(type + " isSkill");
        return (type === "skill");
    }

    __isSpell(type) {
        return (type === "spell");
    }

    
    _updateObject(event, formData){
        //console.log("*-* updated");
        // Update the Item
        super._updateObject(event, formData);
    }

    _onRoll(event){
            event.preventDefault();
            const element = event.currentTarget;
            const dataset = element.dataset;
        
            if(dataset.roll){
                let roll = new roll(dataset.roll, this.actor.data.data);
                let label = dataset.label ? `Rolling ${dataset.label}` : '';
                roll.roll().toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                    flavor: label
                });
        
            }
    }



}
