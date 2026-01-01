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

    // Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch Profiles for both users
    const [user1Response, user2Response] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId1).single(),
      supabase.from('profiles').select('*').eq('id', userId2).single()
    ])

    if (user1Response.error || user2Response.error) {
      throw new Error(`Failed to fetch profiles: ${user1Response.error?.message || user2Response.error?.message}`)
    }

    const profile1: any = user1Response.data
    const profile2: any = user2Response.data

    // 2. Prepare Payload for Python ML Service
    const payload = {
      user1: {
        user_id: profile1.id,
        bio: profile1.bio,
        gender: profile1.gender,
        year_of_study: profile1.year_of_study,
        date_of_birth: profile1.date_of_birth,
        answers: profile1.onboarding_data || {},
        dating_enabled: true
      },
      user2: {
        user_id: profile2.id,
        bio: profile2.bio,
        gender: profile2.gender,
        year_of_study: profile2.year_of_study,
        date_of_birth: profile2.date_of_birth,
        answers: profile2.onboarding_data || {},
        dating_enabled: true
      }
    }

    // 3. Call Python Service
    // Use host.docker.internal to reach the host machine from Supabase Docker container
    const mlServiceUrl = 'http://host.docker.internal:5000/api/ml/calculate-compatibility'
    
    let compatibilityScore = 0
    
    try {
      console.log(`Calling ML Service at ${mlServiceUrl}...`);
      const mlResponse = await fetch(mlServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (mlResponse.ok) {
        const mlData = await mlResponse.json()
        compatibilityScore = mlData.compatibility_score
        console.log("ML Service Success:", compatibilityScore);
      } else {
        console.error('ML Service Error Status:', mlResponse.status);
        throw new Error('ML Service returned non-200')
      }
    } catch (mlErr) {
      console.warn('⚠️ ML Service unreachable. Using fallback logic.', mlErr)
      
      // FALLBACK LOGIC
      // Safely extracting values
      const getValues = (obj: any) => Object.values(obj || {}).flat().map(v => String(v));
      
      const set1 = new Set(getValues(profile1.onboarding_data));
      const list2 = getValues(profile2.onboarding_data);
      
      const common = list2.filter(item => set1.has(item)).length
      const union = new Set([...getValues(profile1.onboarding_data), ...list2]).size
      
      const jaccard = union === 0 ? 0 : (common / union)
      // Generous scoring for demo
      compatibilityScore = Math.min(Math.round((jaccard * 100) + 50 + (Math.random() * 10)), 95)
    }

    // 4. Return Score
    return new Response(
      JSON.stringify({ compatibilityScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
