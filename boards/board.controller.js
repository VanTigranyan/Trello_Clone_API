const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const boardService = require("./board.service");

module.exports = router;

router.post("/create", createBoard);
router.get("/", getBoardsByOwner);
// router.get('/all', getAllBoards);
router.put('/', updateBoard);
router.delete('/:boardId', deleteBoard);


function createBoard(req, res, next) {
  userService
    .getById(req.user.user)
    .then(user => {
      if (user) {
          boardService.createBoard({
            boardName: req.body.boardName,
            owner: user._id
          })
          .then(board => res.json(board))
          .catch(err => next(err))
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => next(err));
}


function getBoardsByOwner(req, res, next) {
    boardService.getBoardsByOwner(req.user.user)
    .then(data => res.json(data.boards))
    .catch(err => next(err))
  }

//   function getAllBoards(req, res, next) {
//       userService.getById(req.user.user)
//       .then(user => {
//           if(user) {
//               boardService.getAllBoards()
//               .then(boards => res.json(boards))
//               .catch(err => next(err))
//           } else {
//               throw 'You have to Log In first to get Boards!'
//           }
//       })
//       .catch(err => next(err))
//   }

function updateBoard(req, res, next) {

    const boardId = req.body.boardId;
    const boardParams = req.body.boardParams;
    boardService.getBoardById(boardId)
    .then(board => {
        if(board.owner == req.user.user) {
            boardService.updateBoard(boardId, boardParams)
            .then(board => {
                return res.json(board)
            })
            .catch(err => next(err))
        } else {
            throw 'You can\'t update the board which owner is not you!'
        }
    })
    .catch(err => next(err))
}

function deleteBoard(req, res, next) {
    boardService.getBoardById(req.params.boardId)
    .then(board => {
        if(board.owner == req.user.user) {
            boardService.deleteBoard(req.params.boardId)
            .then(() => res.json({message: 'Board has been deleted successfully!'}))
            .catch(err => next(err))
        } else {
            throw 'You can\'t delete the Board which owner is not you!'
        }
    })
    .catch(err => next(err))
}