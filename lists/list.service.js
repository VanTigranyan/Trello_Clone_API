const db = require("_helpers/db");
const Board = db.Board;
const List = db.List;
const Card = db.Card;

module.exports = {
    createList,
    getListsByBoard,
    updateList,
    deleteList,
    getListById
}


async function createList(listParams) {
    const board = await Board.findById(listParams.board);
    const list = new List(listParams);

    List.create(list, (err, list) => {
        if(err) {
            throw new Error(err)
        } else {
            board.lists.push(list);
            board.save();
        }
    })
    return list;
}

async function getListsByBoard(boardId) {
    const lists = await Board.findById(boardId)
        .select('lists')
        .populate({
            path: 'lists',
            select: '-owner -boards',
            populate: {
                path: 'cards',
                select: '-owner -card -board'
            }
        })

    return lists
}

async function getListById(listId) {
    const list = await List.findById(listId).populate('cards')
    if(!list) throw new Error('There is no List with such an ID');
    return list;
}

async function updateList (listId, listParams) {
    const list = await List.findByIdAndUpdate(listId, listParams, {new: true})
    .populate({
        path: 'cards',
        select: '-owner -card -board'
    })
    return list;
}

async function deleteList(listId) {
    const list = await List.findById(listId);

    //Remove ref of this list from parent Document
    const board = await Board.findById(list.board);
    board.lists.pull(list);
    board.save();

    //Delete all child Docs
    Card.deleteMany({list: listId});

    return await List.findByIdAndDelete(listId);
}