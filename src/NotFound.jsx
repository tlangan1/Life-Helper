/** @jsxImportSource solid-js */
import "./NotFound.css";

export const NotFound = (props) => {
  var regex = /https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}\/(\w+)/;
  return (
    <div>
      <h1 class="not-found">
        404 - Route{" "}
        <span class="route-not-found">
          /{regex.exec(window.location.href)[1]}
        </span>{" "}
        Not Found
      </h1>
    </div>
  );
};
