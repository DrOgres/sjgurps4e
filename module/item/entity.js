export default class ItemGurps extends Item {

      /**
   * Prepare an object of chat data used to display a card for the Item in the chat log
   * @param {Object} htmlOptions    Options used by the TextEditor.enrichHTML function
   * @return {Object}               An object of chat data to render
   */
  getChatData(htmlOptions={}) {
    const data = duplicate(this.data.data);
    //console.log(data.description.value);
    const labels = this.labels;

    // Rich text description
    data.description.chat = TextEditor.enrichHTML(data.description.value, htmlOptions);

    // Item type specific properties
    const props = [];
    const fn = this[`_${this.data.type}ChatData`];
    if ( fn ) fn.bind(this)(data, labels, props);

    // Filter properties and return
    data.properties = props.filter(p => !!p);
    return data;
  }

  get hasDamage() {
    return !!(this.data.data.damage && this.data.data.damage.bits.length);
  }

  prepareData(){
      super.prepareData();

      const itemData = this.data;
      const data = itemData.data;
      const C = CONFIG.sjgurps4e;
      const labels = {};
      // Damage
      let dam = data.damage || {};
      if ( dam.bits ) {
        labels.damageBase = dam.bits.map(d => d[0]).join(" + ").replace(/\+ -/g, "- ");
        labels.damageModifier = dam.bits.map(d=> d[1]).join(" + ").replace(/\+ -/g, "- ");
        labels.damageType = dam.bits.map(d => C.damageTypes[d[1]]).join(", ");
      }
      this.labels = labels


  }
    
}