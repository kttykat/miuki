import { connect } from "mongoose";
import Filter from "bad-words";

export type O<t = any> = {
  [key: string]: t;
};
const filter = new Filter();
filter.removeWords(
  "fag",
  "fag1t",
  "faget",
  "fagg1t",
  "faggit",
  "faggot",
  "fagg0t",
  "fagit",
  "fags",
  "fagz",
  "faig",
  "faigs",
  "fart",
  "fag*"
);

export const mongoose = () => {
  connect(process.env.DATABASE_URL, {
    dbName: "miuki"
  })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch(() => {
      console.log("Failed to connect to the database");
    });
};

export const html = (content: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@main/css/iconoir.css"
    />
    <title>Miuki</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");
      * {
        padding: 0;
        margin: 0;
      }
      h3 {
        margin-bottom: 0.5rem;
        cursor: pointer;
      }
      body {
        --blue: #2369EC;
        --dark-blue: #1F5ED4;
        --red: #B23A48;
        --red-dark: #ba181b;
        background-color: #000;
        color: #fff;
        font-family: "JetBrains Mono", monospace;
        padding: 4rem;
      }
      p {
        opacity: 0.6;
      }
      .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }
      i {
        font-size: 20px;
      }
      a {
        text-decoration: none;
        color: inherit;
      }
      a:not(.title) {
        color: var(--blue);
      }
      a:not(.title):hover {
        color: var(--dark-blue);
      }
      .error {
        color: var(--red);
        opacity: 1 !imporant;
      }
      .notice {
        opacity: 0.3;
      }
    </style>
  </head>
  <body>
  <h3><a class="title" href="/">Miuki.</a></h3>
    ${content}
  </body>
</html>
`;

export const home = `<p>Minimal link shortner.</p>
<p class="notice">( we are not held responsable for what urls are on the other end of a slug )</p>
<div class="buttons">
  <a href="/github">
    <i class="iconoir-github"></i>
  </a>
  <a href="mailto:hi@miuki.sh">
    <i class="iconoir-send-mail"></i>
  </a>
</div>`;

export const error = (z: string) => `<span class="error">${z}.</span>`;

export const saved = ["create", "saige", "github", "discord", "home"];

export const blocked = (z: string) => {
  return (
    filter.isProfane(z.toLowerCase()) ||
    saved.some((v) => z.toLowerCase().includes(v.toLowerCase()))
  );
};

export const post = (
  data: {
    ok: boolean;
    message: string;
    url?: string;
  },
  raw?: boolean
) => {
  if (raw) {
    return data;
  } else {
    return html(error(`${data.message}`));
  }
};

export const regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/