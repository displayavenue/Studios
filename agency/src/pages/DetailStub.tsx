import { useParams } from "react-router-dom";
import { PlaceholderPage } from "../components/Placeholder";
import "../components/Placeholder.css";

export function DetailStub({ kind }: { kind: string }) {
  const { slug } = useParams();
  const title = slug
    ? `${kind}: ${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
    : kind;

  return (
    <PlaceholderPage
      title={title}
      desc={`This ${kind.toLowerCase()} detail page is a demo stub for displayavenue.com. Content and media will be connected when replacing WordPress.`}
    />
  );
}
