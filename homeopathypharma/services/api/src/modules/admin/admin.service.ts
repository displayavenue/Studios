import {
  getCmsSummary,
  getHomepage,
  listCatalogDoctors,
  listCatalogProducts,
  updateCatalogDoctor,
  updateCatalogProduct,
  saveHomepage,
  type HomepageContent,
} from '@homeopathypharma/content-store';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getSession() {
    return {
      email: 'admin@homeopathypharma.com',
      roles: ['super-admin', 'catalog-manager', 'medical-reviewer', 'support'],
      mfaVerified: true,
    };
  }

  async getDashboard() {
    const products = listCatalogProducts();
    const doctors = listCatalogDoctors();
    const cms = getCmsSummary();
    return {
      pendingVerifications: doctors.filter((d) => d.verificationStatus !== 'VERIFIED').length,
      contentReviews: 0,
      openOrders: 0,
      flaggedReviews: 0,
      publishedProducts: products.length,
      listedDoctors: doctors.length,
      cms,
    };
  }

  async listUsers() {
    return {
      items: [
        {
          id: 'admin_1',
          email: 'admin@homeopathypharma.com',
          roles: ['super-admin'],
        },
      ],
    };
  }

  async getSettings() {
    return {
      storeName: 'HomeopathyPharma',
      currency: 'INR',
      cms: getCmsSummary(),
    };
  }

  async updateSettings(body?: unknown) {
    return { ok: true, settings: body ?? {} };
  }

  async listCatalog() {
    return { items: listCatalogProducts() };
  }

  async patchCatalogProduct(id: string, body?: unknown) {
    const updated = updateCatalogProduct(id, (body ?? {}) as Record<string, unknown>);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async listDoctors() {
    return { items: listCatalogDoctors() };
  }

  async patchDoctor(id: string, body?: unknown) {
    const updated = updateCatalogDoctor(id, (body ?? {}) as Record<string, unknown>);
    if (!updated) throw new NotFoundException('Doctor not found');
    return updated;
  }

  async getHomepage() {
    return getHomepage();
  }

  async updateHomepage(body?: unknown) {
    return saveHomepage(body as HomepageContent);
  }

  async listQueues(queue: string) {
    if (queue === 'doctor-verification') {
      return listCatalogDoctors()
        .filter((d) => d.verificationStatus !== 'VERIFIED')
        .slice(0, 50)
        .map((d) => ({
          id: d.id,
          title: `${d.fullName} · ${d.locality}`,
          submittedAt: new Date().toISOString(),
          priority: 'normal' as const,
        }));
    }
    if (queue === 'product-publish') {
      return listCatalogProducts()
        .filter((p) => !p.inStock)
        .slice(0, 50)
        .map((p) => ({
          id: p.id,
          title: p.name,
          submittedAt: new Date().toISOString(),
          priority: 'low' as const,
        }));
    }
    return [];
  }
}
