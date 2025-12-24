// function: payment-webhook
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const bodyText = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? ''

    if (!signature || !secret) {
        return new Response('Missing signature or secret', { status: 400 })
    }
    
    // Verify signature
    // Note: Deno standard library crypto might differ slightly, using node polyfill if available or native Web Crypto
    // Ideally use: https://deno.land/std@0.177.0/crypto/mod.ts
    // For simplicity in this generated code, we assume createHmac is working via node compat or we implement basic comparison.
    
    const hmac = createHmac('sha256', secret)
    hmac.update(bodyText)
    const expectedSignature = hmac.digest('hex')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const payload = JSON.parse(bodyText)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle Payment Captured
    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
        const orderId = payload.payload.payment.entity.order_id
        
        // Update transaction status
        await supabase
            .from('transactions')
            .update({ status: 'completed' })
            .eq('gateway_transaction_id', orderId)
            
        // Additional Logic based on notes/metadata
        // e.g., Activate Premium
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
