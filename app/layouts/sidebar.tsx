import { useEffect, useRef } from "react";
import {
  Outlet,
  Form,
  NavLink,
  Link,
  useNavigation,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/root";

import { getContacts } from "../data";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searchInputRef = useRef(null);
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  console.log("navigation state:", navigation.state);
  useEffect(() => {
    searchInputRef.current.value = q || "";
  }, []);

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(event) => submit(event.currentTarget)}
          >
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              placeholder="Search"
              className={searching ? "loading" : ""}
              type="search"
              defaultValue={q || ""}
              ref={searchInputRef}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === "loading" ? "loading" : ""}
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}
