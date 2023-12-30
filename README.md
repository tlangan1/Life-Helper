# Life Helper SolidJS Application

## Notes

1. Do not put an ampersand, `&`, in the name of a folder anywhere in the path within which `vite` is being used. It results in an error thrown by node.js saying that it cannot find vite. I did `NOT` try an uninstall and reinstall of `vite` to see if that may also be a solution.

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

## Enable https in Vite:

1. First, install @vitejs/plugin-basic-ssl using the following command:
   ```
   npm i -D @vitejs/plugin-basic-ssl
   ```
   Note the -D option as this should never be used in production.
2. Next add basicSsl() to the plugins array in the vite config file as shown below:

   ```
   plugins: [
        /*
        Uncomment the following line to enable solid-devtools.
        For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
        */
        // devtools(),
        solidPlugin(),
        basicSsl(),
   ],
   ```

3. I enabled https support by adding the `basicSsl` plugin from "@vitejs/plugin-basic-ssl" to the Vite config file.

## Multi User Considerations

1. For now I am going to gloss over multi-user considerations like preventing two users from starting the same task or pushing changes out from the database as they get posted so that all users are aware.
