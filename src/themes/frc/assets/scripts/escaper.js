(() => {
    'use strict';

    /*
     * Escapes square brackets in Discovery search queries.
     *
     * Solr parses "[...]" in a query as range syntax, so a search for
     * "Arizona [Territory]" makes the REST API respond with an error
     * unless the brackets are escaped: "Arizona \[Territory\]".
     *
     * Only the "query" parameter of Discovery search forms needs this
     * (the global header form, /search, scoped community/collection
     * search tabs, /mydspace). Browse pages ("startsWith"/"value") do
     * NOT: the backend matches those values literally, so brackets
     * must be left intact there. Browse breakage with brackets was a
     * URL-encoding bug fixed in browse.service.ts instead.
     *
     * Two layers:
     *
     * 1. Form-field interception (primary): capture-phase listeners
     *    rewrite the value the user typed *before* Angular's own
     *    handlers read it, so the corrected value is what Angular
     *    sends to the REST API. No reload needed.
     *
     * 2. URL sanitization (fallback): covers pasted/bookmarked URLs.
     *    This layer can only fix the URL after the fact, so it
     *    reloads the page.
     */

    /*
     * Routes whose "query" parameter is a Discovery query:
     *
     * /search
     * /communities/<uuid>/search
     * /collections/<uuid>/search
     * /mydspace
     */
    const QUERY_ROUTE_MATCHES = (pathname) => (
        pathname === '/search' ||
        pathname.endsWith('/search') ||
        pathname === '/mydspace'
    );

    /*
     * Inputs the form-field layer is allowed to touch. Deliberately
     * narrow so unrelated inputs — including the browse "startsWith"
     * box, which must keep its brackets — are never modified. Every
     * ds-search-form instance uses name="query".
     */
    const SEARCH_INPUT_SELECTOR = [
        'input[name="query"]',
        'input[id="query"]'
    ].join(', ');

    let processing = false;

    /*
     * Escapes only square brackets that are not already escaped.
     *
     * [Territory]   -> \[Territory\]
     * \[Territory\] -> \[Territory\]
     */
    function escapeUnescapedBrackets(value) {
        let result = '';
        let consecutiveBackslashes = 0;

        for (const character of value) {
            const isBracket = character === '[' || character === ']';
            const isAlreadyEscaped = consecutiveBackslashes % 2 === 1;

            if (isBracket && !isAlreadyEscaped) {
                result += '\\';
            }

            result += character;

            if (character === '\\') {
                consecutiveBackslashes++;
            } else {
                consecutiveBackslashes = 0;
            }
        }

        return result;
    }

    /*
     * ------------------------------------------------------------------
     * Layer 1: form-field interception
     * ------------------------------------------------------------------
     */

    /*
     * Rewrites the input's value and notifies Angular. Dispatching
     * "input" makes both ngModel and reactive FormControl instances
     * pick up the new value synchronously, before the submit/click
     * handler that follows this capture-phase listener runs.
     */
    function sanitizeInput(input) {
        if (!input || typeof input.value !== 'string') {
            return;
        }

        const sanitized = escapeUnescapedBrackets(input.value);

        if (sanitized === input.value) {
            return;
        }

        input.value = sanitized;

        input.dispatchEvent(
            new Event('input', { bubbles: true })
        );
    }

    function sanitizeContainerInputs(container) {
        if (!container || typeof container.querySelectorAll !== 'function') {
            return;
        }

        const inputs = container.querySelectorAll(SEARCH_INPUT_SELECTOR);

        for (const input of inputs) {
            sanitizeInput(input);
        }
    }

    /*
     * Runs before Angular's (ngSubmit) handler, which is attached to
     * the form itself and therefore fires after document capture.
     */
    document.addEventListener(
        'submit',
        (event) => {
            sanitizeContainerInputs(event.target);

            /*
             * Angular may still change the route asynchronously.
             */
            setTimeout(sanitizeUrl, 0);
        },
        true
    );

    /*
     * Covers components that submit via (keyup.enter) instead of a
     * form submit: keydown capture fires before any keyup handler.
     */
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            const target = event.target;

            if (
                target &&
                typeof target.matches === 'function' &&
                target.matches(SEARCH_INPUT_SELECTOR)
            ) {
                sanitizeInput(target);
            }
        },
        true
    );

    /*
     * Covers submission via a search button click. Sanitizes the
     * surrounding form before Angular processes the click, and
     * re-checks the URL afterwards because Angular may change the
     * route after processing the click.
     */
    document.addEventListener(
        'click',
        (event) => {
            const target = event.target;

            if (target && typeof target.closest === 'function') {
                const form = target.closest('form');

                if (form) {
                    sanitizeContainerInputs(form);
                }
            }

            setTimeout(sanitizeUrl, 0);
        },
        true
    );

    /*
     * ------------------------------------------------------------------
     * Layer 2: URL fallback
     * ------------------------------------------------------------------
     */

    function sanitizeUrl() {
        if (processing) {
            return;
        }

        const url = new URL(window.location.href);

        if (!QUERY_ROUTE_MATCHES(url.pathname)) {
            return;
        }

        /*
         * Preserve repeated parameters when present.
         */
        const values = url.searchParams.getAll('query');

        if (values.length === 0) {
            return;
        }

        const sanitizedValues = values.map(escapeUnescapedBrackets);

        const changed = sanitizedValues.some(
            (value, index) => value !== values[index]
        );

        if (!changed) {
            return;
        }

        url.searchParams.delete('query');

        for (const value of sanitizedValues) {
            url.searchParams.append('query', value);
        }

        processing = true;

        /*
         * Full navigation is intentional because Angular has already
         * issued the invalid request by the time the URL reflects it;
         * reloading with the corrected URL settles the state.
         */
        window.location.replace(url.toString());
    }

    function scheduleSanitization() {
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(sanitizeUrl);
            return;
        }

        Promise.resolve().then(sanitizeUrl);
    }

    function wrapHistoryMethod(methodName) {
        const originalMethod = history[methodName];

        history[methodName] = function (...args) {
            const result = originalMethod.apply(this, args);

            scheduleSanitization();

            return result;
        };
    }

    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');

    window.addEventListener(
        'popstate',
        scheduleSanitization
    );

    sanitizeUrl();
})();
