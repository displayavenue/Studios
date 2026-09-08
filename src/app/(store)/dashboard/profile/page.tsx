import { BirthDetailsForm } from "@/components/site/birth-details-form";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function ProfilePage() {
  return (
    <div>
      <PageHero
        eyebrow="Account"
        title="Birth details"
        subtitle="Accurate place and time improve chart quality. You can update these whenever your records change."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl">
          <BirthDetailsForm mode="profile" />
        </Surface>
      </SectionShell>
    </div>
  );
}
