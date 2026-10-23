# p5-trello-system

LLD project implementation.

Backend 
backend
│
├── controllers
│    boardController.js
│    listController.js
│    cardController.js
│
├── services
│    boardService.js
│    listService.js
│    cardService.js
│
├── repositories
│    boardRepository.js
│    listRepository.js
│    cardRepository.js
│
├── models
│    User.js
│    Board.js
│    List.js
│    Card.js
│
├── routes
│    boardRoutes.js
│    listRoutes.js
│    cardRoutes.js
│
├── middleware
│    authMiddleware.js
│
└── utils


src
│
├── app
│    App.jsx
│    routes.jsx
│
├── pages
│    DashboardPage.jsx
│    BoardPage.jsx
│
├── features
│    board
│       components
│           BoardHeader.jsx
│           BoardMembers.jsx
│       hooks
│           useBoard.js
│       services
│           boardService.js
│
│    list
│       components
│           List.jsx
│           AddList.jsx
│       hooks
│           useLists.js
│       services
│           listService.js
│
│    card
│       components
│           Card.jsx
│           CardModal.jsx
│           AddCard.jsx
│       hooks
│           useCards.js
│       services
│           cardService.js
│
├── components
│    UI
│       Button.jsx
│       Modal.jsx
│       Input.jsx
│       Avatar.jsx
│
├── context
│    AuthContext.jsx
│
├── hooks
│    useAuth.js
│
├── services
│    apiClient.js
│
├── utils
│    helpers.js
│
├── styles
│    global.css
│
└── assets