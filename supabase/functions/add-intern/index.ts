
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { fullName, email, role, startDate, endDate } = body

    // Validate required fields
    if (!fullName?.trim() || !email?.trim() || !role?.trim() || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'All fields are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'End date must be after start date' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate unique certificate ID and verification code
    const { data: certificateId, error: certError } = await supabaseClient.rpc('generate_unique_code', { prefix: 'SM' })
    const { data: verificationCode, error: verifyError } = await supabaseClient.rpc('generate_unique_code', { prefix: 'SM' })

    if (certError || verifyError) {
      console.error('Error generating codes:', { certError, verifyError })
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to generate unique codes' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if email already exists
    const { data: existingIntern } = await supabaseClient
      .from('interns')
      .select('id')
      .eq('email', email.trim())
      .single()

    if (existingIntern) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'An intern with this email already exists' 
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: intern, error } = await supabaseClient
      .from('interns')
      .insert({
        full_name: fullName.trim(),
        email: email.trim(),
        role: role.trim(),
        start_date: startDate,
        end_date: endDate,
        certificate_id: certificateId,
        verification_code: verificationCode,
        status: 'Active'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to add intern: ${error.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, intern }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
