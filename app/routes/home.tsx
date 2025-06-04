import type { Route } from "./+types/home";
import { SkipList } from "../components/SkipList";
import "../styles/home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Skip Hire - RemWaste" },
    { name: "description", content: "Find skip hire options in your area" },
  ];
}

export default function Home() {
  return (
    <div>
      <div className="skip-container">
        <h1>Choose Your Skip Size</h1>
        <SkipList postcode="NR32" area="Lowestoft" />
      </div>
    </div>
  );
}
