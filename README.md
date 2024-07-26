# Life Helper SolidJS Application

## Notes

1. About time 3:45 into the `Register & Install a Service Worker` subsection of the `Service Worker Project` section of the `Exploring Service Workers` [tutorial](https://frontendmasters.com/courses/service-workers/register-install-a-service-worker/) by Kyle Simpson he explains the `file system scope` of a service worker and how he obfuscates the physical location with a server route. It makes me think that there is a way in Vite that I can accomplish the same thing.
1. Do not put an ampersand, `&`, in the name of a folder anywhere in the path within which `vite` is being used. It results in an error thrown by node.js saying that it cannot find vite. I did `NOT` try an uninstall and reinstall of `vite` to see if that may also be a solution.

## TODOs 1/15/2024

<span id="service-worker-in-root"></span>

1. Embed the data server routes in the SolidJS/Vite server so that the issue with the <a href="#phone-experience">data access</a> of the phone experience is resolved
1. **When I moved server.js to the root, I was able to send messages to the client, that is, the web page itself.**
1. **When I change the name of the service worker file the behavior is the same as changing its contents.**
1. **Without skipWaiting called in the install event, the new service worker is not used until the page is closed and reopened.**
1. **Enable service worker changes to activate without closing and reopening the app. To do this most effectively I needed to both issue a `skipWaiting()` in the install event as well as a `event.waitUntil(clients.claim())` in the activation event.**
1. Log service worker changes and retiring previous service worker DB rows. Perhaps I should create a new entity web_push_subscription_version which maintains a history of service workers that all use the same capability url.s
1. I should create a route using solidJS to give the appearance that the service worker file is at the root and move it to a more logical place in the file system. See <a href="#service-worker-in-root">item number 1</a> above
1. All the data required by the interface should be cached. The service worker should update the cache when a push is received.

## Basics

1. To start this application run the following command.
   ```
   npm run dev
   ```
1. This application uses the `Express Server` application as the backend. It assumes it is listening on port 3001.
1. Note that it is important that this application starts on port 3000 as the server overrides `CORS` for requests coming from this port.

## Vite Build and Preview

1. In both cases I need to manually put a copy of service_worker.js in the dist directory.
2. There should be some way to automate this.

## Search Resources

1. See VSCode stuff located in D:\Computer Science\NEED TO REVIEW\JavaScript\Orchestrate Asynchronicity
1. See `Netflix Search Box` section of D:\Computer Science\Tutorials\Front End Masters\Abandoned\Frameworks\Asynchronous Programming with RxJS\Asynchronous Programming in JavaScript.docx.
1. See VSCode stuff located in D:\Computer Science\NEED TO REVIEW\JavaScript\Observables 1
1. See VSCode stuff located in D:\Computer Science\Tutorials\Front End Masters\Abandoned\JavaScript\Rethinking Asynchronous JavaScript. Specifically, `Exercises\Ex6`

## Application Behavior

1. a task is `active` if it is started but not completed.
2. a task is `inactive` if it is not `active, completed or aborted`.`
3. A task cen be deleted only if it is not active, that is, has been started.
4. A task can be aborted only if it has been started and not completed and the user provides an explanation.
5. A task can be started but it can only be `un-started` if the task is not completed and if the user provides an explanation.
6. A task can be can only be `un-completed` if the user provides an explanation.
7. A task can be paused only if it has been started and not completed.

```mermaid
  flowchart LR
      inactive<-. "start, unstart (with explanation)" .->active
      active-. "aborted (with explanation)" .->aborted
      active<-. "completed uncompleted (with explanation)" .->completed
```

## Enable https in Vite and self-signed SSL certificates:

1. Get a USB-c backup device so that I can backup and restore my phones data in the event that I break something. To navigate to the backup capability go to Settings->Accounts and backup->External storage transfer.
2. The use @vitejs/plugin-basic-ssl to enable https did not work; however, mkcert did. Using it resulted in the following SSL certificate with issuer `mkcert DESKTOP-4QSML4N\tomla@DESKTOP-4QSML4N (Thomas Langan)` issued to value `DESKTOP-4QSML4N\tomla@DESKTOP-4QSML4N (Thomas Langan)`. I then placed this SSL certificate in the certificates in the `Trusted Root Certification Authorities` node in the Microsoft Management Console accessible accessible using the `mmc` command. I saved a view in mmc called "Console1.mmc" to more easily navigate to the list of certificates where this certificate is stored.
   <span id="phone-experience"></span>
3. Since service workers require HTTPS (which is SSL now called TLS running over HTTP) and I cannot get my phone to install the self-signed SSL certificate mentioned above the same way I did on my laptop associated with the express server I am using to fetch and store data I cannot get the application to function on my phone on my local network.
4. I need to have chrome on my phone trust the security certificate. If I view the certificate on my phone using the `Certificate viewer` it shows that it covers the following domains:
   1. localhost
   2. 192.168.1.10
   3. 127.0.0.1
   4. 172.17.192.1
   5. 172.20.144.1
5. Here are some relevant resources:
   1. [This](https://stackoverflow.com/questions/57565665/one-self-signed-cert-to-rule-them-all-chrome-android-and-ios) looks very promising. I should implement it but I may want to wait until I get the USB-c drive. However, I am not convinced the backup to USB-c will include the security certificates...I should ensure this.
   2. [Here](https://www.openssl.org/docs/man3.0/man1/openssl.html) is the documentation for openssl command.
6. I THINK THIS IS A COP OUT: I have a hunch that if I can embed the data server routes in the vite server than I will at least be able to experience the data access on my phone. Currently the site will load even though it does not trust the certificate but it throws an SSL error when I attempt to interact with the express server.
7. Also, I figured out how to debug my phone's browser on my laptop. See [this](https://developer.chrome.com/docs/devtools/remote-debugging) for the instructions.

## Self-Signed Certificates and Service Workers

1. See [this](https://serviceworke.rs/) resource for all sorts of service worker implementations. Note that the UI design is a little weird and that the code associated with each of the `recipes` is accessible through the tiny links in the top right-hand corner. Also, if you click a code link that does not have code associated with it the interface does not inform you of that it just navigates to the page without the links which is really weird.

## Service Workers:

1. Remember that if you go to the Application tab of Chrome Dev Tools you can see the service worker associated with that tab. You can also do things like `Stop` it and `Unregister` it. Also available at the bottom of the service workers panel is a link to `See all registrations`.
2. To reset the permissions for the service worker do the following:
   1. Open the browser settings
   2. Click on `Privacy and Security`
   3. Click on `Site Settings`
   4. Scroll to the appropriate URL, for example, https://127.0.0.1:3000 or https://localhost:3000 or both
   5. Click the right-pointing triangle
   6. Change Notifications from "Allow" to "Ask"

## Multi User Considerations

### Working On Line

1. Prevent two users from starting the same task.

### Working Off Line

1. Do not allow a user to start a task but do allow them to work on it and complete it.
