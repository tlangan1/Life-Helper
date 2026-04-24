import "./CSS/NotFound.css";

export const NotFound = (props) => {
  return (
    <div>
      <h1 class="not-found">
        404 - Route{" "}
        <span class="route-not-found">
          {window.location.href.replace(window.location.origin, "")}
        </span>{" "}
        Not Found
      </h1>
    </div>
  );
};
