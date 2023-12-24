# Life Helper SolidJS Application

## Basics

1. To start this application run the following command.
   ```
   npm run dev
   ```
1. This application uses the `Express Server` application as the backend. It assumes it is listening on port 3001.
1. Note that it is important that this application starts on port 3000 as the server overrides `CORS` for requests coming from this port.

## Search Resources

1. See VSCode stuff located in D:\Computer Science\NEED TO REVIEW\JavaScript\Orchestrate Asynchronicity
1. See `Netflix Search Box` section of D:\Computer Science\Tutorials\Front End Masters\Abandoned\Frameworks\Asynchronous Programming with RxJS\Asynchronous Programming in JavaScript.docx.
1. See VSCode stuff located in D:\Computer Science\NEED TO REVIEW\JavaScript\Observables 1
1. See VSCode stuff located in D:\Computer Science\Tutorials\Front End Masters\Abandoned\JavaScript\Rethinking Asynchronous JavaScript. Specifically, `Exercises\Ex6`

## Application Behavior

1. A task can be started but it can only be `un-started` if the task is not completed and if the user provides an explanation.
2. A task can be can only be `un-completed` if the user provides an explanation.
3. A task can be paused only if it has been started and not completed.

## https support:

1. I enabled https support by adding the `basicSsl` plugin from "@vitejs/plugin-basic-ssl" to the Vite config file.

## Multi User Considerations

1. For now I am going to gloss over multi-user considerations like preventing two users from starting the same task or pushing changes out from the database as they get posted so that all users are aware.
