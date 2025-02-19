import {createHydrogenContext} from '@shopify/hydrogen';
import { createPackClient, PackSession } from '@pack/hydrogen'
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createAppLoadContext(request, env, executionContext) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  // const [cache, session] = await Promise.all([
  //   caches.open('hydrogen'),
  //   AppSession.init(request, [env.SESSION_SECRET]),
  // ]);

  const [cache, session, packSession] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
    PackSession.init(request, [env.SESSION_SECRET]),
  ])

  const pack = createPackClient({
    cache,
    waitUntil,
    storeId: env.PACK_STOREFRONT_ID,
    token: env.PACK_SECRET_TOKEN,
    session: packSession,
    contentEnvironment: env.PACK_CONTENT_ENVIRONMENT,
  })

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    pack,
    // declare additional Remix loader context
  };
}
