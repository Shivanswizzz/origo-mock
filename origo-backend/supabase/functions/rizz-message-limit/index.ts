// function: rizz-message-limit
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { conversationId, senderId } = await req.json()

    // Create client with Service Key to bypass RLS for checking counters
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get conversation details
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (error) throw error
    if (!conversation) throw new Error('Conversation not found')

    // If Rizz mode is off, unlimited messages
    if (!conversation.is_rizz_active) {
      return new Response(JSON.stringify({ canSend: true, remaining: -1 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Determine message count
    let messageCount = 0
    if (senderId === conversation.user_id_1) {
      messageCount = conversation.messages_sent_by_user1
    } else {
      messageCount = conversation.messages_sent_by_user2
    }

    const canSend = messageCount < 5

    return new Response(
      JSON.stringify({
        canSend,
        remainingMessages: canSend ? 5 - messageCount : 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
