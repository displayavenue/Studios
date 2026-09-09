import { seedSampleExperts } from "../src/services/experts/service";

async function main() {
  const result = await seedSampleExperts();
  console.log("seedSampleExperts", result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
