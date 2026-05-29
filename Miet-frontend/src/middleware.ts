import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'hi'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export const config = {
    // Match all pathnames except for
    // - ... if they start with `/api`, `/auth`, `/_next` or `/_vercel`
    // - ... the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)']
};
