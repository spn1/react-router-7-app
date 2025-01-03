import { deleteContact } from "../data";
import type { Route } from "../+types/root";
import { redirect } from "react-router";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  return redirect("/");
}
