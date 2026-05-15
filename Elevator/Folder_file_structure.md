> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository ,  Repo , service , singleton if required  where it needs so give me backend tree structure to simulate  above and show

```txt
backend/
│
├── src/
│
│   ├── app.js
│   │    └── bootstrapApplication()
│   │
│   ├── server.js
│   │    └── startServer()
│   │
│   ├── config/
│   │
│   │   ├── env.js
│   │   │    └── loadEnvConfig()
│   │   │
│   │   ├── db.js
│   │   │    └── connectMongoDB()
│   │   │
│   │   └── socket.js
│   │        ├── initializeSocketServer()
│   │        └── getIO()                  // singleton
│   │
│   ├── shared/
│   │
│   │   ├── constants/
│   │   │
│   │   │    ├── elevatorState.js
│   │   │    ├── direction.js
│   │   │    ├── requestType.js
│   │   │    └── elevatorEvent.js
│   │   │
│   │   ├── errors/
│   │   │
│   │   │    ├── AppError.js
│   │   │    └── asyncHandler.js
│   │   │
│   │   ├── utils/
│   │   │
│   │   │    ├── priorityQueue.js
│   │   │    ├── logger.js
│   │   │    └── distanceCalculator.js
│   │   │
│   │   └── base/
│   │        ├── BaseRepository.js
│   │        └── BaseState.js
│   │
│   ├── modules/
│   │
│   │   ├── elevator/
│   │   │
│   │   │   ├── controller/
│   │   │   │
│   │   │   │    ├── elevator.controller.js
│   │   │   │    │    ├── createHallRequest()
│   │   │   │    │    ├── createCabinRequest()
│   │   │   │    │    ├── getSystemSnapshot()
│   │   │   │    │    └── controlSimulation()
│   │   │   │    │
│   │   │   │    └── elevator.socket.controller.js
│   │   │   │         ├── onSimulationStart()
│   │   │   │         ├── onSimulationPause()
│   │   │   │         └── broadcastElevatorState()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │
│   │   │   │    └── elevator.routes.js
│   │   │   │         └── registerElevatorRoutes()
│   │   │   │
│   │   │   ├── model/
│   │   │   │
│   │   │   │    ├── elevator.model.js
│   │   │   │    ├── request.model.js
│   │   │   │    └── simulation.model.js
│   │   │   │
│   │   │   ├── repository/
│   │   │   │
│   │   │   │    ├── ElevatorRepository.js
│   │   │   │    │    ├── create()
│   │   │   │    │    ├── updateState()
│   │   │   │    │    ├── updateCurrentFloor()
│   │   │   │    │    ├── findAll()
│   │   │   │    │    └── findById()
│   │   │   │    │
│   │   │   │    └── RequestRepository.js
│   │   │   │         ├── create()
│   │   │   │         ├── markCompleted()
│   │   │   │         ├── getPendingRequests()
│   │   │   │         └── findActiveRequests()
│   │   │   │
│   │   │   ├── service/
│   │   │   │
│   │   │   │    ├── ElevatorSimulationService.js
│   │   │   │    │    ├── tick()
│   │   │   │    │    ├── moveElevators()
│   │   │   │    │    ├── processRequests()
│   │   │   │    │    └── updateSimulation()
│   │   │   │    │
│   │   │   │    ├── ElevatorDispatchService.js
│   │   │   │    │    ├── assignElevator()
│   │   │   │    │    └── dispatchRequest()
│   │   │   │    │
│   │   │   │    ├── ElevatorMovementService.js
│   │   │   │    │    ├── moveUp()
│   │   │   │    │    ├── moveDown()
│   │   │   │    │    ├── stopAtFloor()
│   │   │   │    │    └── processNextDestination()
│   │   │   │    │
│   │   │   │    ├── DoorService.js
│   │   │   │    │    ├── openDoor()
│   │   │   │    │    ├── closeDoor()
│   │   │   │    │    └── reopenDoor()
│   │   │   │    │
│   │   │   │    └── RequestService.js
│   │   │   │         ├── createHallRequest()
│   │   │   │         ├── createCabinRequest()
│   │   │   │         ├── completeRequest()
│   │   │   │         └── validateRequest()
│   │   │   │
│   │   │   ├── strategy/
│   │   │   │
│   │   │   │    ├── ElevatorSelectionStrategy.js
│   │   │   │    │    └── selectElevator()
│   │   │   │    │
│   │   │   │    ├── NearestElevatorStrategy.js
│   │   │   │    │    └── selectElevator()
│   │   │   │    │
│   │   │   │    ├── SameDirectionStrategy.js
│   │   │   │    │    └── selectElevator()
│   │   │   │    │
│   │   │   │    └── LeastBusyStrategy.js
│   │   │   │         └── selectElevator()
│   │   │   │
│   │   │   ├── state/
│   │   │   │
│   │   │   │    ├── ElevatorStateFactory.js
│   │   │   │    │    └── createState()
│   │   │   │    │
│   │   │   │    ├── IdleState.js
│   │   │   │    │    ├── handleRequest()
│   │   │   │    │    └── next()
│   │   │   │    │
│   │   │   │    ├── MovingUpState.js
│   │   │   │    │    ├── move()
│   │   │   │    │    └── next()
│   │   │   │    │
│   │   │   │    ├── MovingDownState.js
│   │   │   │    │    ├── move()
│   │   │   │    │    └── next()
│   │   │   │    │
│   │   │   │    ├── OpeningState.js
│   │   │   │    │    ├── open()
│   │   │   │    │    └── next()
│   │   │   │    │
│   │   │   │    └── ClosingState.js
│   │   │   │         ├── close()
│   │   │   │         ├── interruptClose()
│   │   │   │         └── next()
│   │   │   │
│   │   │   ├── factory/
│   │   │   │
│   │   │   │    ├── ElevatorFactory.js
│   │   │   │    │    └── createElevator()
│   │   │   │    │
│   │   │   │    └── RequestFactory.js
│   │   │   │         ├── createHallRequest()
│   │   │   │         └── createCabinRequest()
│   │   │   │
│   │   │   ├── scheduler/
│   │   │   │
│   │   │   │    └── SimulationScheduler.js
│   │   │   │         ├── start()
│   │   │   │         ├── stop()
│   │   │   │         └── tick()
│   │   │   │
│   │   │   ├── events/
│   │   │   │
│   │   │   │    ├── ElevatorEventBus.js
│   │   │   │    └── ElevatorEventHandler.js
│   │   │   │
│   │   │   ├── dto/
│   │   │   │
│   │   │   │    ├── createHallRequest.dto.js
│   │   │   │    └── createCabinRequest.dto.js
│   │   │   │
│   │   │   └── mapper/
│   │   │
│   │   │        └── elevator.mapper.js
│   │   │             ├── toResponse()
│   │   │             └── toSimulationPayload()
│   │   │
│   │   └── health/
│   │
│   │        ├── health.routes.js
│   │        └── health.controller.js
│   │             └── checkHealth()
│   │
│   └── index.js
│        └── initializeApplication()
│
├── package.json
├── .env
├── .gitignore
└── README.md
```


> **Prompt** Good now come to the frontend so you created  screens for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 

```txt id="q6m0ru"
frontend/
│
├── src/
│
│   ├── main.jsx
│   │    └── bootstrapReactApp()
│   │
│   ├── App.jsx
│   │    └── App()
│   │
│   ├── router/
│   │
│   │   ├── AppRouter.jsx
│   │   │    └── AppRouter()
│   │   │
│   │   └── routes.js
│   │        └── appRoutes
│   │
│   ├── config/
│   │
│   │   ├── axios.js
│   │   │    └── createAxiosClient()
│   │   │
│   │   ├── socket.js
│   │   │    ├── initializeSocket()
│   │   │    └── getSocket()                // singleton
│   │   │
│   │   └── env.js
│   │        └── loadEnvironmentConfig()
│   │
│   ├── shared/
│   │
│   │   ├── constants/
│   │   │
│   │   │    ├── elevatorState.js
│   │   │    ├── direction.js
│   │   │    ├── requestType.js
│   │   │    └── simulationStatus.js
│   │   │
│   │   ├── hooks/
│   │   │
│   │   │    ├── useSocket.js
│   │   │    ├── useInterval.js
│   │   │    └── useSimulation.js
│   │   │
│   │   ├── services/
│   │   │
│   │   │    ├── apiClient.js
│   │   │    ├── socketClient.js
│   │   │    └── notificationService.js
│   │   │
│   │   ├── utils/
│   │   │
│   │   │    ├── elevatorColor.js
│   │   │    ├── directionIcon.js
│   │   │    ├── floorFormatter.js
│   │   │    └── requestFormatter.js
│   │   │
│   │   ├── layouts/
│   │   │
│   │   │    ├── DashboardLayout.jsx
│   │   │    │    └── DashboardLayout()
│   │   │    │
│   │   │    └── SimulationLayout.jsx
│   │   │         └── SimulationLayout()
│   │   │
│   │   └── components/
│   │
│   │        ├── buttons/
│   │        │
│   │        │    ├── IconButton.jsx
│   │        │    │    └── IconButton()
│   │        │    │
│   │        │    ├── FloorButton.jsx
│   │        │    │    └── FloorButton()
│   │        │    │
│   │        │    └── SimulationControlButton.jsx
│   │        │         └── SimulationControlButton()
│   │        │
│   │        ├── cards/
│   │        │
│   │        │    ├── ElevatorCard.jsx
│   │        │    │    └── ElevatorCard()
│   │        │    │
│   │        │    ├── RequestCard.jsx
│   │        │    │    └── RequestCard()
│   │        │    │
│   │        │    └── StatCard.jsx
│   │        │         └── StatCard()
│   │        │
│   │        ├── indicators/
│   │        │
│   │        │    ├── DirectionIndicator.jsx
│   │        │    │    └── DirectionIndicator()
│   │        │    │
│   │        │    ├── DoorIndicator.jsx
│   │        │    │    └── DoorIndicator()
│   │        │    │
│   │        │    └── ElevatorStateBadge.jsx
│   │        │         └── ElevatorStateBadge()
│   │        │
│   │        ├── panels/
│   │        │
│   │        │    ├── HallCallPanel.jsx
│   │        │    │    ├── HallCallPanel()
│   │        │    │    ├── handleUpRequest()
│   │        │    │    └── handleDownRequest()
│   │        │    │
│   │        │    ├── CabinPanel.jsx
│   │        │    │    ├── CabinPanel()
│   │        │    │    ├── handleFloorSelection()
│   │        │    │    ├── handleOpenDoor()
│   │        │    │    └── handleCloseDoor()
│   │        │    │
│   │        │    └── SimulationControlPanel.jsx
│   │        │         ├── SimulationControlPanel()
│   │        │         ├── handleStart()
│   │        │         ├── handlePause()
│   │        │         └── handleStop()
│   │        │
│   │        ├── visualizer/
│   │        │
│   │        │    ├── ElevatorShaft.jsx
│   │        │    │    └── ElevatorShaft()
│   │        │    │
│   │        │    ├── ElevatorCab.jsx
│   │        │    │    └── ElevatorCab()
│   │        │    │
│   │        │    ├── FloorLane.jsx
│   │        │    │    └── FloorLane()
│   │        │    │
│   │        │    └── ElevatorMovementAnimator.jsx
│   │        │         └── ElevatorMovementAnimator()
│   │        │
│   │        ├── logs/
│   │        │
│   │        │    ├── EventLogList.jsx
│   │        │    │    └── EventLogList()
│   │        │    │
│   │        │    └── EventLogItem.jsx
│   │        │         └── EventLogItem()
│   │        │
│   │        └── loaders/
│   │
│   │             └── SimulationLoader.jsx
│   │                  └── SimulationLoader()
│   │
│   ├── modules/
│   │
│   │   ├── dashboard/
│   │   │
│   │   │    ├── pages/
│   │   │    │
│   │   │    │    └── DashboardPage.jsx
│   │   │    │         └── DashboardPage()
│   │   │    │
│   │   │    ├── sections/
│   │   │    │
│   │   │    │    ├── TopStatsSection.jsx
│   │   │    │    │    └── TopStatsSection()
│   │   │    │    │
│   │   │    │    ├── ElevatorSimulationSection.jsx
│   │   │    │    │    └── ElevatorSimulationSection()
│   │   │    │    │
│   │   │    │    ├── ActiveRequestsSection.jsx
│   │   │    │    │    └── ActiveRequestsSection()
│   │   │    │    │
│   │   │    │    ├── ElevatorStatusSection.jsx
│   │   │    │    │    └── ElevatorStatusSection()
│   │   │    │    │
│   │   │    │    └── EventLogsSection.jsx
│   │   │    │         └── EventLogsSection()
│   │   │    │
│   │   │    ├── hooks/
│   │   │    │
│   │   │    │    └── useDashboardData.js
│   │   │    │         └── useDashboardData()
│   │   │    │
│   │   │    └── services/
│   │   │
│   │   │         └── dashboard.service.js
│   │   │              └── fetchDashboardSnapshot()
│   │   │
│   │   ├── elevator/
│   │   │
│   │   │    ├── pages/
│   │   │    │
│   │   │    │    ├── ElevatorSimulationPage.jsx
│   │   │    │    │    └── ElevatorSimulationPage()
│   │   │    │    │
│   │   │    │    └── ElevatorDetailsPage.jsx
│   │   │    │         └── ElevatorDetailsPage()
│   │   │    │
│   │   │    ├── hooks/
│   │   │    │
│   │   │    │    ├── useElevatorSimulation.js
│   │   │    │    │    └── useElevatorSimulation()
│   │   │    │    │
│   │   │    │    └── useElevatorSocketSync.js
│   │   │    │         └── useElevatorSocketSync()
│   │   │    │
│   │   │    ├── services/
│   │   │    │
│   │   │    │    ├── elevatorApi.service.js
│   │   │    │    │    ├── createHallRequest()
│   │   │    │    │    ├── createCabinRequest()
│   │   │    │    │    ├── fetchElevators()
│   │   │    │    │    └── controlSimulation()
│   │   │    │    │
│   │   │    │    └── elevatorSocket.service.js
│   │   │    │         ├── subscribeElevatorUpdates()
│   │   │    │         └── subscribeRequestUpdates()
│   │   │    │
│   │   │    ├── mapper/
│   │   │    │
│   │   │    │    └── elevator.mapper.js
│   │   │    │         ├── mapElevatorCard()
│   │   │    │         └── mapRequestCard()
│   │   │    │
│   │   │    └── store/
│   │   │
│   │   │         └── elevator.store.js
│   │   │              ├── useElevatorStore()
│   │   │              ├── setElevators()
│   │   │              ├── addRequest()
│   │   │              └── updateElevatorState()
│   │   │
│   │   ├── request/
│   │   │
│   │   │    ├── pages/
│   │   │    │
│   │   │    │    └── RequestMonitorPage.jsx
│   │   │    │         └── RequestMonitorPage()
│   │   │    │
│   │   │    ├── services/
│   │   │    │
│   │   │    │    └── request.service.js
│   │   │    │         ├── fetchActiveRequests()
│   │   │    │         └── fetchCompletedRequests()
│   │   │    │
│   │   │    └── components/
│   │   │
│   │   │         └── RequestQueueList.jsx
│   │   │              └── RequestQueueList()
│   │   │
│   │   └── settings/
│   │
│   │        ├── pages/
│   │        │
│   │        │    └── SettingsPage.jsx
│   │        │         └── SettingsPage()
│   │        │
│   │        └── components/
│   │
│   │             ├── StrategySelector.jsx
│   │             │    ├── StrategySelector()
│   │             │    └── handleStrategyChange()
│   │             │
│   │             └── SimulationSpeedSelector.jsx
│   │                  ├── SimulationSpeedSelector()
│   │                  └── handleSpeedChange()
│   │
│   ├── styles/
│   │
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   └── index.css
│
├── public/
│
│   ├── icons/
│   ├── sounds/
│   └── images/
│
├── package.json
├── vite.config.js
├── .env
├── .gitignore
└── README.md
```
