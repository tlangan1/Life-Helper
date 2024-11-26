## Todos

### Completed TODOs

- [x] Remove the start checkbox and delete button from the ProjectItem component.
- [x] Add an expand checkbox to the ProjectItem component.
- [x] Create a Stub ProjectItemDetail component that contains detailed data about the objectives/goals/tasks and includes a start capability for tasks and a delete capability for all three item types.

### In Progress TODOs

- [ ] Enhance the ProjectItemDetail component.
  - [x] Populate it with data about the objectives/goals/tasks...currently just the description.
  - [x] Populate detail data when the item is expanded the first time
  - [x] Enable navigation to the item's children.
  - [x] Log the issue of \n in in string breaking stored procedure call...see `Issues` subsection of the `main documentation README`.
    - [x] Before I do this enhance the logging of database errors so that they are well documented and can be tracked and fixed in the future.v
  - [x] Include functionality to start tasks.
  - [ ] Include functionality to delete all three item types.

### Yet to be Completed TODOs

- [ ] Create a clear cache button/menu option to experiment with caching.
- [ ] Add network status event listeners to the web page and the service worker. Perhaps one or the other should be the source of truth instead of bot independently discovering the network status.
  - [ ] See [this](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) documentation for the web page.
  - [ ] See [this](https://developer.mozilla.org/en-US/docs/Web/API/WorkerNavigator/onLine) documentation for the service worker.
  - [ ] Note that a web app can be online but the server may be down. This is a separate situation to deal with. Web sockets might be the way to detect this situation.
