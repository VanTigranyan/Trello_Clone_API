const db = require("_helpers/db");
const List = db.List;
const Card = db.Card;

module.exports = {
    createCard,
    getCardsByList,
    updateCard,
    deleteCard,
    getCardById
}


async function createCard(cardParams) {
    const list = await List.findById(cardParams.list);
    cardParams.board = list.board;

    const card = new Card(cardParams);

    Card.create(card, (err, card) => {
        if(err) {
            throw new Error(err)
        } else {
            list.cards.push(card);
            list.save();
        }
    })
    return card;
}

async function getCardsByList(listId) {
    const cards = await List.findById(listId)
        .select('cards')
        .populate('cards');

    return cards
}

async function getCardById(cardId) {
    const card = await Card.findById(cardId);

    if(!card) throw new Error('There is no Card with such an ID');

    return card;
}

async function updateCard (cardId, cardParams) {
    return await Card.findByIdAndUpdate(cardId, cardParams, {new: true})
}

async function deleteCard(cardId) {
    const card = await Card.findById(cardId);

    if(!card || !cardId) throw new Error('Provide valid Card ID');

    //Remove ref of this list from parent Document
    const list = await List.findById(card.list);
    list.cards.pull(card);
    list.save();

    return await Card.findByIdAndDelete(cardId);
}