import "dotenv/config";
import express from "express";
import links from "./links";
import { blocked, error, home, html, mongoose, O, post, regexp } from "./utils";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  return res.send(`${html(home)}`);
});

app.get("/:slug", async (req, res) => {
  if (!req.params.slug) return res.send(html(error(`Failed to locate url`)));
  const z = req.params.slug.toLowerCase().split(" ").join("-");
  const url = await links.findOne({
    link: `${z}`,
  });
  if (!url)
    return res.send(
      html(
        error(`Failed to locate url, <a href="https://miuki.sh/${z}">here</a>`)
      )
    );
    
  res.redirect(url.url)
});

app.post("/create", async (req, res) => {
  const { slug, url, raw } = req.body as {
    slug: string;
    url: string;
    raw?: boolean;
  };

  if (!slug || !url)
    return res.send(
      post(
        {
          ok: false,
          message: `Missing "slug" or "url" in request body parameters`,
        },
        raw
      )
    );
  const z = slug.toLowerCase().split(" ").join("-");
  const u = url.toLowerCase().split(" ").join("-");
  const link = await links.findOne({
    slug: `${z}`,
  });

  if(!regexp.test(u))  return res.send(
    post(
      {
        ok: false,
        message: `Invalid url provided.`,
      },
      raw
    )
  );
  if (link)
    return res.send(
      post(
        {
          ok: false,
          message: `Url already exists`,
        },
        raw
      )
    );

  if (blocked(slug))
    return res.send(
      post(
        {
          ok: false,
          message: `Your "slug" has been blocked, please choose another`,
        },
        raw
      )
    );

  links.create({
    slug: `${z}`,
    url: `${url}`,
  });

  return res.send(
    post({
      ok: true,
      message: `Link generated you can find it here <a href="https://miuki.sh/${z}">here</a>`,
      url: `https://miuki.sh/${z}`,
    })
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
  mongoose();
});
