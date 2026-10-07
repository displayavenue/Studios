import { Injectable, NotFoundException } from '@nestjs/common';
import { listCatalogDoctors, updateCatalogDoctor } from '@homeopathypharma/content-store';

@Injectable()
export class DoctorsService {
  async listPublic(city?: string) {
    const items = listCatalogDoctors().filter((d) =>
      city ? d.city.toLowerCase() === city.toLowerCase() : true,
    );
    return { items, total: items.length };
  }

  async getBySlug(slug: string) {
    const doctor = listCatalogDoctors().find((d) => d.slug === slug);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async getProfile() {
    return listCatalogDoctors()[0] ?? null;
  }

  async updateProfile(body?: unknown) {
    const first = listCatalogDoctors()[0];
    if (!first) return null;
    return updateCatalogDoctor(first.id, (body ?? {}) as Record<string, unknown>);
  }

  async getAvailability() {
    return { slots: [], note: 'Availability confirmed at booking request time' };
  }

  async setAvailability(body?: unknown) {
    return { ok: true, received: body ?? null };
  }

  async listPatients() {
    return { items: [] };
  }
}
