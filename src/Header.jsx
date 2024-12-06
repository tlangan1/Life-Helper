/** @jsxImportSource solid-js */

export const Header = (props) => (
  <>
    <header>
      <nav class="nav-using-flex">
        <a class="navlink home" id="linkHome" href="/">
          <img src="/home.svg" />{" "}
        </a>
        <h1>
          <a href="/life">Life Helper</a>
        </h1>
        <a class="navlink account" id="linkOrder" href="/account">
          <img src="/account.svg" />{" "}
        </a>
      </nav>
    </header>
    {props.children}
  </>
);
