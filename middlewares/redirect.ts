import { ServerResponse } from 'http';
import Router from 'next/router';

/**
 * Redirects the user to the specified URL path
 */
export function redirect(res: ServerResponse, path: string) {
  if (res) {
    res.writeHead(301, { Location: path });
    res.end();
  } else {
    Router.push(path);
  }
}
