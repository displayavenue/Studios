import { useParams } from "react-router-dom";
import { DetailPage, NotFoundDetail } from "../components/DetailPage";
import { useCatalogPage, useCms } from "../cms/CmsProvider";
import "../styles/pages.css";

function useSlug() {
  return useParams().slug ?? "";
}

function CatalogRoute({
  kind,
  label,
}: {
  kind:
    | "services"
    | "industries"
    | "packages"
    | "solutions"
    | "ai"
    | "tools"
    | "cases"
    | "projects"
    | "resources";
  label: string;
}) {
  const slug = useSlug();
  const page = useCatalogPage(kind, slug);
  if (!page) return <NotFoundDetail kind={label} slug={slug} />;
  return <DetailPage page={page} />;
}

export function ServiceDetail() {
  return <CatalogRoute kind="services" label="Service" />;
}
export function IndustryDetail() {
  return <CatalogRoute kind="industries" label="Industry" />;
}
export function PackageDetail() {
  return <CatalogRoute kind="packages" label="Package" />;
}
export function SolutionDetail() {
  return <CatalogRoute kind="solutions" label="Solution" />;
}
export function AiSuiteDetail() {
  return <CatalogRoute kind="ai" label="AI suite" />;
}
export function ToolCategoryDetail() {
  return <CatalogRoute kind="tools" label="Tool category" />;
}
export function CaseStudyDetail() {
  return <CatalogRoute kind="cases" label="Case study" />;
}
export function ProjectDetail() {
  return <CatalogRoute kind="projects" label="Project" />;
}
export function ResourceDetail() {
  return <CatalogRoute kind="resources" label="Resource" />;
}

/** Industry × service combination landing page */
export function IndustryServiceCombo() {
  const { industry = "", service = "" } = useParams();
  const { combos } = useCms();
  const page = combos.find(
    (c) => c.industrySlug === industry && c.serviceSlug === service,
  );
  if (!page) {
    return (
      <NotFoundDetail kind="Industry service page" slug={`${industry}/${service}`} />
    );
  }
  return <DetailPage page={page} />;
}
