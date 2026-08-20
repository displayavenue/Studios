SET NAMES utf8mb4;
SET sql_mode = 'STRICT_ALL_TABLES';

CREATE TABLE IF NOT EXISTS company_profile (
  id CHAR(26) PRIMARY KEY,
  legal_name VARCHAR(191) NOT NULL DEFAULT 'Mediashouter',
  brand_name VARCHAR(191) NOT NULL DEFAULT 'DisplayAvenue',
  gstin VARCHAR(32) NOT NULL DEFAULT '27ALJPY9454C1ZJ',
  pan VARCHAR(20) NULL,
  phone VARCHAR(32) NOT NULL DEFAULT '9222122333',
  whatsapp VARCHAR(32) NULL,
  email VARCHAR(191) NULL,
  website VARCHAR(191) NOT NULL DEFAULT 'https://displayavenue.com',
  registered_address TEXT NULL,
  billing_address TEXT NULL,
  state VARCHAR(64) NOT NULL DEFAULT 'Maharashtra',
  city VARCHAR(64) NULL,
  pincode VARCHAR(16) NULL,
  country VARCHAR(64) NOT NULL DEFAULT 'India',
  logo_url TEXT NULL,
  authorized_person VARCHAR(191) NULL,
  designation VARCHAR(191) NULL,
  bank_name VARCHAR(191) NULL,
  account_name VARCHAR(191) NULL,
  account_number VARCHAR(64) NULL,
  ifsc VARCHAR(32) NULL,
  upi_id VARCHAR(191) NULL,
  default_gst_percent DECIMAL(5,2) NOT NULL DEFAULT 18,
  default_advance_pct DECIMAL(5,2) NOT NULL DEFAULT 60,
  default_validity_days INT NOT NULL DEFAULT 15,
  quotation_prefix VARCHAR(16) NOT NULL DEFAULT 'DA',
  quotation_digits INT NOT NULL DEFAULT 5,
  invoice_prefix VARCHAR(16) NOT NULL DEFAULT 'DAV',
  receipt_prefix VARCHAR(16) NOT NULL DEFAULT 'DAR',
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  razorpay_enabled TINYINT(1) NOT NULL DEFAULT 1,
  why_choose_json JSON NULL,
  trust_json JSON NULL,
  whatsapp_template TEXT NULL,
  email_subject_template VARCHAR(255) NULL,
  email_body_template TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_clients (
  id CHAR(26) PRIMARY KEY,
  client_code VARCHAR(32) NOT NULL UNIQUE,
  company_name VARCHAR(191) NOT NULL,
  contact_person VARCHAR(191) NULL,
  email VARCHAR(191) NULL,
  mobile VARCHAR(32) NULL,
  whatsapp VARCHAR(32) NULL,
  gstin VARCHAR(32) NULL,
  pan VARCHAR(20) NULL,
  address TEXT NULL,
  city VARCHAR(64) NULL,
  state VARCHAR(64) NULL,
  pincode VARCHAR(16) NULL,
  country VARCHAR(64) NOT NULL DEFAULT 'India',
  website VARCHAR(191) NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clients_name (company_name),
  INDEX idx_clients_email (email),
  INDEX idx_clients_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_services (
  id CHAR(26) PRIMARY KEY,
  category VARCHAR(128) NOT NULL DEFAULT 'General',
  name VARCHAR(191) NOT NULL,
  description TEXT NULL,
  unit_price_paise INT NOT NULL DEFAULT 0,
  gst_percent DECIMAL(5,2) NOT NULL DEFAULT 18,
  billing_type VARCHAR(32) NOT NULL DEFAULT 'one_time',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_services_cat (category),
  INDEX idx_services_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quotation_sequences (
  id CHAR(26) PRIMARY KEY,
  prefix VARCHAR(16) NOT NULL,
  year INT NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_prefix_year (prefix, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoice_sequences (
  id CHAR(26) PRIMARY KEY,
  prefix VARCHAR(16) NOT NULL,
  fy_label VARCHAR(16) NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_inv_prefix_fy (prefix, fy_label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS receipt_sequences (
  id CHAR(26) PRIMARY KEY,
  prefix VARCHAR(16) NOT NULL,
  fy_label VARCHAR(16) NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_rcpt_prefix_fy (prefix, fy_label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quotations (
  id CHAR(26) PRIMARY KEY,
  client_id CHAR(26) NOT NULL,
  quotation_number VARCHAR(64) NOT NULL UNIQUE,
  secure_token VARCHAR(64) NOT NULL UNIQUE,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  payment_status VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
  version INT NOT NULL DEFAULT 1,
  quotation_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  title VARCHAR(255) NULL,
  notes TEXT NULL,
  internal_notes TEXT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  company_state VARCHAR(64) NOT NULL DEFAULT 'Maharashtra',
  client_state VARCHAR(64) NULL,
  gst_mode VARCHAR(16) NOT NULL DEFAULT 'CGST_SGST',
  subtotal_paise INT NOT NULL DEFAULT 0,
  discount_paise INT NOT NULL DEFAULT 0,
  taxable_paise INT NOT NULL DEFAULT 0,
  cgst_paise INT NOT NULL DEFAULT 0,
  sgst_paise INT NOT NULL DEFAULT 0,
  igst_paise INT NOT NULL DEFAULT 0,
  total_gst_paise INT NOT NULL DEFAULT 0,
  grand_total_paise INT NOT NULL DEFAULT 0,
  payment_plan_type VARCHAR(32) NOT NULL DEFAULT 'ADVANCE_BALANCE',
  advance_percent DECIMAL(5,2) NOT NULL DEFAULT 60,
  advance_paise INT NOT NULL DEFAULT 0,
  balance_paise INT NOT NULL DEFAULT 0,
  paid_paise INT NOT NULL DEFAULT 0,
  terms_snapshot TEXT NULL,
  sent_at DATETIME NULL,
  viewed_at DATETIME NULL,
  accepted_at DATETIME NULL,
  accepted_name VARCHAR(191) NULL,
  accepted_email VARCHAR(191) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_client FOREIGN KEY (client_id) REFERENCES quote_clients(id),
  INDEX idx_quote_status (status),
  INDEX idx_quote_pay (payment_status),
  INDEX idx_quote_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quotation_items (
  id CHAR(26) PRIMARY KEY,
  quotation_id CHAR(26) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  service_name VARCHAR(191) NOT NULL,
  category VARCHAR(128) NULL,
  description TEXT NULL,
  quantity DECIMAL(12,3) NOT NULL DEFAULT 1,
  unit_price_paise INT NOT NULL DEFAULT 0,
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  discount_paise INT NOT NULL DEFAULT 0,
  gst_percent DECIMAL(5,2) NOT NULL DEFAULT 18,
  taxable_paise INT NOT NULL DEFAULT 0,
  gst_paise INT NOT NULL DEFAULT 0,
  total_paise INT NOT NULL DEFAULT 0,
  billing_type VARCHAR(32) NOT NULL DEFAULT 'one_time',
  catalog_service_id CHAR(26) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_quote FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
  INDEX idx_items_quote (quotation_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_payments (
  id CHAR(26) PRIMARY KEY,
  quotation_id CHAR(26) NOT NULL,
  client_id CHAR(26) NOT NULL,
  kind VARCHAR(32) NOT NULL DEFAULT 'ADVANCE',
  status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
  amount_paise INT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  razorpay_order_id VARCHAR(64) NULL,
  razorpay_payment_id VARCHAR(64) NULL,
  razorpay_signature VARCHAR(191) NULL,
  receipt_number VARCHAR(64) NULL,
  invoice_number VARCHAR(64) NULL,
  paid_at DATETIME NULL,
  raw_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_quote FOREIGN KEY (quotation_id) REFERENCES quotations(id),
  CONSTRAINT fk_pay_client FOREIGN KEY (client_id) REFERENCES quote_clients(id),
  INDEX idx_pay_quote (quotation_id),
  INDEX idx_pay_order (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_webhook_events (
  id CHAR(26) PRIMARY KEY,
  event_id VARCHAR(128) NULL,
  event_type VARCHAR(128) NULL,
  payload_json JSON NULL,
  processed TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
