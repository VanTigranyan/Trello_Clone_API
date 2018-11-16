const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const boardService = require("../boards/board.service");
const listService = require("../lists/list.service");
const cardService = require("./card.service");

module.exports = router;

router.post("/create", createCard);
router.get("/:listId", getCardsByList);
router.put('/', updateCard);
router.delete('/:cardId', deleteCard);
// router.get('/all', getAllBoards);


function createCard(req, res, next) {
  userService
    .getById(req.user.user)
    .then(user => {
      if (user) {

          cardService.createCard({
            cardName: req.body.cardName,
            owner: user._id,
            list: req.body.list,
            description: req.body.description || '',
            participants: req.body.participants || [],
          })
          .then(card => res.json(card))
          .catch(err => next(err))
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => next(err));
}


function getCardsByList(req, res, next) {
    
    const listId = req.params.listId;

    userService.getById(req.user.user)
        .then(user => {
            listService.getListById(listId)
                .then(list => {
                    if (list.owner != req.user.user) {
                        throw new Error('The info of Cards is available only for owner!')
                    } else {
                        cardService.getCardsByList(listId)
                            .then(data => res.json(data.cards))
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

function updateCard(req, res, next) {

    const cardId = req.body.cardId;
    const cardParams = req.body.cardParams;

    cardService.getCardById(cardId)
    .then(card => {
        if(card.owner == req.user.user) {
            cardService.updateCard(cardId, cardParams)
            .then(updatedCard => {
                return res.json(updatedCard)
            })
            .catch(err => next(err))
        } else {
            throw 'You can\'t update the Card which owner is not you!'
        }
    })
    .catch(err => next(err))
}

function deleteCard(req, res, next) {
    cardService.getCardById(req.params.cardId)
    .then(card => {
        if(card.owner == req.user.user) {
            cardService.deleteCard(req.params.cardId)
            .then(() => res.json({
                message: 'Card has been deleted successfully!'
            }))
            .catch(err => net(err))
        } else {
            throw 'You can\'t delete the Card which owner is not you!'
        }
    })
    .catch(err => next(err))
}