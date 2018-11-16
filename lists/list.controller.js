const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const boardService = require("../boards/board.service");
const listService = require("./list.service");

module.exports = router;

router.post("/create", createList);
router.get("/:boardId", getListsByBoard);
router.put('/', updateList);
router.delete('/:listId', deleteList);
// router.get('/all', getAllBoards);


function createList(req, res, next) {
  userService
    .getById(req.user.user)
    .then(user => {
      if (user) {
          console.log(req.body);
          listService.createList({
            listName: req.body.listName,
            owner: user._id,
            board: req.body.board,
          })
          .then(list => res.json(list))
          .catch(err => next(err))
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => next(err));
}


function getListsByBoard(req, res, next) {
    
    const boardId = req.params.boardId;

    userService.getById(req.user.user)
        .then(user => {
            boardService.getBoardById(boardId)
                .then(board => {
                    if (board.owner != req.user.user) {
                        throw new Error('The info of Lists is available only for owner!')
                    } else {
                        listService.getListsByBoard(boardId)
                            .then(data => res.json(data.lists))
                            .catch(err => next(err))
                    }
                })
                .catch(err => next(err))
        })
        .catch(err=> next(err))

  }

//   function getAllLists(req, res, next) {
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

function updateList(req, res, next) {

    const listId = req.body.listId;
    const listParams = req.body.listParams;

    listService.getListById(listId)
    .then(list => {
        if(list.owner == req.user.user) {
            listService.updateList(listId, listParams)
            .then(updatedList => {
                return res.json(updatedList)
            })
            .catch(err => next(err))
        } else {
            throw 'You can\'t update the List which owner is not you!'
        }
    })
    .catch(err => next(err))
}

function deleteList(req, res, next) {
    listService.getListById(req.params.listId)
    .then(list => {
        if(list.owner == req.user.user) {
            listService.deleteList(req.params.listId)
            .then(() => res.json({
                message: 'List has been deleted successfully!'
            }))
            .catch(err => net(err))
        } else {
            throw 'You can\'t delete the Board which owner is not you!'
        }
    })
    .catch(err => next(err))
}