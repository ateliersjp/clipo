self.addEventListener('install', () => {
  console.log(`Yay! Service worker is installed 🎉`);
});

async function handleScriptWithoutEventListener({ request }) {
  const response = await fetch(request);
  const body = await response.text();
  const toIndex = body.indexOf('window.addEventListener');
  return new Response(toIndex === -1 ? body : body.substring(0, toIndex), response);
}

async function handleShareTarget({ url, request, event }) {
  const link = Array.from(url.searchParams.values())
    .map((value) => {
      try {
        return new URL(value);
      } catch {
        return;
      }
    })
    .find(Boolean);

  if (link instanceof URL) {
    return Response.redirect(link.pathname);
  }

  return Response.redirect('/');
}

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.routing.registerRoute(
    ({ url }) => url.pathname === '/dialog.js',
    handleScriptWithoutEventListener
  );
  workbox.routing.registerRoute(
    ({ url }) => url.pathname === '/share_target/',
    handleShareTarget
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
