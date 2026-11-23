import { useState } from "react";
import type { FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "userPool" });

export default function App() {
  const { signOut } = useAuthenticator();
  const [ingredients, setIngredients] = useState("chicken, rice, broccoli");
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setRecipe("");
    try {
      const { data, errors } = await client.queries.askBedrock({
        ingredients: ingredients.split(",").map((x) => x.trim()).filter(Boolean),
      });
      if (errors?.length) {
        throw new Error(errors.map((x) => x.message).join("; "));
      }
      if (data?.error) throw new Error(data.error);
      if (!data?.body) throw new Error("No recipe returned. Please try again.");
      setRecipe(data.body);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : String(problem));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="panel">
      <div className="topline">
        <span>Amazon Bedrock • Claude Haiku 4.5</span>
        <button className="signout" onClick={signOut}>Sign out</button>
      </div>
      <form onSubmit={generate}>
        <label htmlFor="ingredients">Your ingredients</label>
        <p>Separate each ingredient with a comma.</p>
        <input
          id="ingredients"
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          required
        />
        <button type="submit" disabled={busy || !ingredients.trim()}>
          {busy ? "Generating your recipe..." : "Generate recipe"}
        </button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {recipe && (
        <section className="recipe">
          <h2>Your generated recipe</h2>
          <div>{recipe}</div>
        </section>
      )}
    </main>
  );
}
