const db = require("_helpers/db");
const User = db.User;
const List = db.List;
const Card = db.Card;
const Board = db.Board;

module.exports = {
    createBoard,
    getBoardsByOwner,
    updateBoard,
    deleteBoard,
    getBoardById
}


async function createBoard(boardParams) {
    const user = await User.findById(boardParams.owner).select('-hash');

    const board = new Board(boardParams);

    Board.create(board, (err, board) => {
        if(err) {
            throw new Error(err)
        } else {
            user.boards.push(board);
            user.save()
        }
    })
    return board;
}

async function getBoardsByOwner(userId) {
    const boards = await User.findById(userId)
        .populate('boards','-owner')
    return boards
}

async function getBoardById(boardId) {
    const board = await Board.findById(boardId).populate('lists','-board')
    if(!board) throw new Error('There is no Board with such an ID');
    return board;
}

async function updateBoard (boardId, boardParams) {
    return await Board.findByIdAndUpdate(boardId, boardParams, {new: true})
}

async function deleteBoard(boardId) {
    const board = await Board.findById(boardId);

    if(!board || !boardId) throw new Error('Provide valid Board ID');

    //Remove ref of this list from parent Document
    const user = await User.findById(board.owner);
    user.boards.pull(board);
    user.save();

    // Delete All Child Dependant Documents in other Collections
    List.deleteMany({board: boardId});
    Card.deleteMany({board: boardId});

    return await Board.findByIdAndDelete(boardId);
}