export function isSoftDeleted(entity: { deletedAt: Date | null }): boolean {
  return entity.deletedAt !== null;
}

export function isPubliclyVisible(entity: {
  status: string;
  deletedAt?: Date | null;
}): boolean {
  if (entity.deletedAt) return false;
  return entity.status === "PUBLISHED" || entity.status === "ACTIVE";
}
