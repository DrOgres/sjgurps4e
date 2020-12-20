export function addChatListeners(html) {
    html.on('click', 'dice-total', displayMore);
    
}

function displayMore(event) {

    const card = event.currentTarget.closest("name");
    let owner = game.actors.get(card.dataset.ownerID);
    let item = owner.getOwnedItem(card.dataset.itemID);
    
}