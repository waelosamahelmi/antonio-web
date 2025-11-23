// Backend API URL - use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface CreatePaymentIntentRequest {
  amount: number; // Total amount in euros (will be converted to cents)
  currency?: string;
  paymentMethodTypes?: string[];
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface StripeConfigResponse {
  publishableKey: string;
}

/**
 * Get Stripe configuration (publishable key) from backend database
 */
export async function getStripeConfig(): Promise<StripeConfigResponse> {
  try {
    const response = await fetch(`${API_URL}/api/stripe/config`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to fetch Stripe config');
    }

    const data: StripeConfigResponse = await response.json();

    if (!data || !data.publishableKey) {
      throw new Error('Invalid Stripe configuration');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    throw error;
  }
}

export async function createPaymentIntent(
  params: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  try {
    const response = await fetch(`${API_URL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount, // Backend will convert to cents
        currency: params.currency || 'eur',
        paymentMethodTypes: params.paymentMethodTypes || ['card'],
        metadata: params.metadata || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to create payment intent');
    }

    const data: CreatePaymentIntentResponse = await response.json();

    if (!data || !data.clientSecret) {
      throw new Error('Invalid response from payment server');
    }

    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export async function confirmPayment(
  params: ConfirmPaymentRequest
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/stripe/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}
