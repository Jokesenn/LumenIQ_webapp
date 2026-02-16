import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const rawNext = searchParams.get('next') ?? '/dashboard'
  // Sécurité : empêcher les redirections vers des URLs externes (open redirect)
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Si c'est une récupération de mot de passe, rediriger vers la page de reset
      if (type === 'recovery') {
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/login/reset-password`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/login/reset-password`)
        } else {
          return NextResponse.redirect(`${origin}/login/reset-password`)
        }
      }

      // Sinon, rediriger vers le dashboard ou la page demandée
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // En cas d'erreur, rediriger vers la page de login avec un message d'erreur
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
