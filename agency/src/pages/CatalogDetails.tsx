import { useParams } from "react-router-dom";
import { DetailPage, NotFoundDetail } from "../components/DetailPage";
import { getServicePage } from "../data/serviceCatalog";
import { getIndustryPage } from "../data/industryCatalog";
import { getPackagePage } from "../data/packageCatalog";
import { getSolutionPage } from "../data/solutionCatalog";
import { getAiPage } from "../data/aiCatalog";
import { getToolPage } from "../data/toolCatalog";
import { getCasePage } from "../data/caseCatalog";
import { getProjectPage } from "../data/projectCatalog";
import { getResourcePage } from "../data/resourceCatalog";
import "../styles/pages.css";

function useSlug() {
  return useParams().slug ?? "";
}

export function ServiceDetail() {
  const slug = useSlug();
  const page = getServicePage(slug);
  if (!page) return <NotFoundDetail kind="Service" slug={slug} />;
  return <DetailPage page={page} />;
}

export function IndustryDetail() {
  const slug = useSlug();
  const page = getIndustryPage(slug);
  if (!page) return <NotFoundDetail kind="Industry" slug={slug} />;
  return <DetailPage page={page} />;
}

export function PackageDetail() {
  const slug = useSlug();
  const page = getPackagePage(slug);
  if (!page) return <NotFoundDetail kind="Package" slug={slug} />;
  return <DetailPage page={page} />;
}

export function SolutionDetail() {
  const slug = useSlug();
  const page = getSolutionPage(slug);
  if (!page) return <NotFoundDetail kind="Solution" slug={slug} />;
  return <DetailPage page={page} />;
}

export function AiSuiteDetail() {
  const slug = useSlug();
  const page = getAiPage(slug);
  if (!page) return <NotFoundDetail kind="AI suite" slug={slug} />;
  return <DetailPage page={page} />;
}

export function ToolCategoryDetail() {
  const slug = useSlug();
  const page = getToolPage(slug);
  if (!page) return <NotFoundDetail kind="Tool category" slug={slug} />;
  return <DetailPage page={page} />;
}

export function CaseStudyDetail() {
  const slug = useSlug();
  const page = getCasePage(slug);
  if (!page) return <NotFoundDetail kind="Case study" slug={slug} />;
  return <DetailPage page={page} />;
}

export function ProjectDetail() {
  const slug = useSlug();
  const page = getProjectPage(slug);
  if (!page) return <NotFoundDetail kind="Project" slug={slug} />;
  return <DetailPage page={page} />;
}

export function ResourceDetail() {
  const slug = useSlug();
  const page = getResourcePage(slug);
  if (!page) return <NotFoundDetail kind="Resource" slug={slug} />;
  return <DetailPage page={page} />;
}
