// function: generate-compatibility-score
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
    const { userId1, userId2 } = await req.json()
    
    // In Phase 3, this will call the Python ML Service
    // For Phase 2 MVP, we simulate a score based on random logic + mock interests
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Fetch user 1 interests
    const { data: ints1 } = await supabase
       .from('user_interests')
       .select('interest_id')
       .eq('user_id', userId1)
       
    // Fetch user 2 interests
    const { data: ints2 } = await supabase
       .from('user_interests')
       .select('interest_id')
       .eq('user_id', userId2)
       
    // Allow logic even if empty for demo
    const arr1 = ints1?.map(x => x.interest_id) || []
    const arr2 = ints2?.map(x => x.interest_id) || []
    
    const common = arr1.filter(id => arr2.includes(id)).length
    const union = new Set([...arr1, ...arr2]).size
    
    let score = 50 // Base score
    if (union > 0) {
        score += (common / union) * 50
    }
    
    // Add some randomness for "Vibe Check"
    score = Math.min(Math.round(score + (Math.random() * 10)), 99)

    return new Response(
      JSON.stringify({ compatibilityScore: score }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
