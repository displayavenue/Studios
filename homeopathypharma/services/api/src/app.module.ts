import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware.js';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware.js';
import { CsrfGuard } from './common/guards/csrf.guard.js';
import { AuthGuard } from './common/guards/auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor.js';
import { InMemorySessionStore } from './common/session/in-memory-session.store.js';
import { SESSION_STORE, SessionStore } from './common/session/session-store.interface.js';
import { ObservabilityModule } from './observability/observability.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { DoctorsModule } from './modules/doctors/doctors.module.js';
import { CatalogModule } from './modules/catalog/catalog.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { CartModule } from './modules/cart/cart.module.js';
import { CheckoutModule } from './modules/checkout/checkout.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ShipmentsModule } from './modules/shipments/shipments.module.js';
import { ConsultationsModule } from './modules/consultations/consultations.module.js';
import { ReferralsModule } from './modules/referrals/referrals.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { SeoModule } from './modules/seo/seo.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { SupportModule } from './modules/support/support.module.js';
import { AuditModule } from './modules/audit/audit.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ObservabilityModule,
    JobsModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    DoctorsModule,
    CatalogModule,
    SearchModule,
    CartModule,
    CheckoutModule,
    PaymentsModule,
    ShipmentsModule,
    ConsultationsModule,
    ReferralsModule,
    ReviewsModule,
    ContentModule,
    SeoModule,
    NotificationsModule,
    SupportModule,
    AuditModule,
    AdminModule,
    WebhooksModule,
    HealthModule,
  ],
  providers: [
    { provide: SESSION_STORE, useClass: InMemorySessionStore },
    { provide: SessionStore, useExisting: SESSION_STORE },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
