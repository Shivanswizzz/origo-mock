// function: verify-college-email
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
    const { email } = await req.json()
    if (!email) throw new Error('Email is required')

    const domain = email.split('@')[1]
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Check against colleges table
    const { data: college } = await supabase
      .from('colleges')
      .select('id, name')
      .eq('domain', domain)
      .single()
    
    if (!college) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Email domain not recognized. Please use your official college email (e.g., student@iitd.ac.in).' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 } // Return 200 so frontend handles logic gracefully
      )
    }
    
    return new Response(
      JSON.stringify({ 
        valid: true, 
        college: college 
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
