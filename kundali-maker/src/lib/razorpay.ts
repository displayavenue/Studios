import { PRICING } from './pricing'

export type RazorpayProduct = 'kundali' | 'remedies' | 'milan'

export interface RazorpayStatus {
  configured: boolean
  allow_demo: boolean
  key_id: string
  currency: string
  mode: 'live' | 'test' | 'unset'
}

interface CreateOrderResponse {
  orderId: string
  amount: number
  currency: string
  keyId: string
  receipt: string
}

interface VerifyResponse {
  verified: boolean
  razorpay_order_id: string
  razorpay_payment_id: string
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, cb: (resp: unknown) => void) => void
    }
  }
}

function apiBase(): string {
  // Same-origin on production; Vite proxy not required if using absolute path
  return `${import.meta.env.BASE_URL.replace(/\/?$/, '/') }api`
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`)
  }
  return data
}

export async function fetchRazorpayStatus(): Promise<RazorpayStatus> {
  try {
    const res = await fetch(`${apiBase()}/razorpay-status.php`, { credentials: 'same-origin' })
    return await parseJson<RazorpayStatus>(res)
  } catch {
    return {
      configured: false,
      allow_demo: true,
      key_id: '',
      currency: 'INR',
      mode: 'unset',
    }
  }
}

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed')))
      return
    }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.dataset.razorpay = '1'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load Razorpay checkout'))
    document.body.appendChild(s)
  })
}

export async function startRazorpayCheckout(opts: {
  product: RazorpayProduct
  localOrderId: string
  amountInr: number
  customerName: string
  description: string
  prefillEmail?: string
  prefillContact?: string
}): Promise<{ razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }> {
  const amountInr = opts.amountInr || (
    opts.product === 'kundali'
      ? PRICING.kundaliInr
      : opts.product === 'remedies'
        ? PRICING.remediesInr
        : PRICING.milanInr
  )

  const created = await parseJson<CreateOrderResponse>(
    await fetch(`${apiBase()}/razorpay-create-order.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        amountInr,
        receipt: opts.localOrderId,
        product: opts.product,
        notes: { local_order_id: opts.localOrderId },
      }),
    }),
  )

  await loadRazorpayScript()
  if (!window.Razorpay) throw new Error('Razorpay unavailable')

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      name: 'Jyotish Kundali',
      description: opts.description,
      order_id: created.orderId,
      prefill: {
        name: opts.customerName,
        email: opts.prefillEmail || '',
        contact: opts.prefillContact || '',
      },
      notes: {
        local_order_id: opts.localOrderId,
        product: opts.product,
      },
      theme: { color: '#5c1a1a' },
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        try {
          await parseJson<VerifyResponse>(
            await fetch(`${apiBase()}/razorpay-verify.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'same-origin',
              body: JSON.stringify(response),
            }),
          )
          resolve({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
        } catch (e) {
          reject(e instanceof Error ? e : new Error('Payment verification failed'))
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    })

    rzp.on('payment.failed', (resp: unknown) => {
      const msg =
        typeof resp === 'object' && resp && 'error' in resp
          ? String((resp as { error?: { description?: string } }).error?.description || 'Payment failed')
          : 'Payment failed'
      reject(new Error(msg))
    })

    rzp.open()
  })
}
