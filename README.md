# TFeed

It is a web application for watching public telegram channels, it is built on such technologies:

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [tailwindcss](https://tailwindcss.com/)
- [VK UI](https://vkcom.github.io/VKUI)
- [Axios](https://axios-http.com/docs/intro)
- [Cloudflare Pages](https://pages.cloudflare.com/)

> The template was created using [pnpm](https://pnpm.io/). Therefore, it is required to use
> it for this project as well. Using other package managers, you will receive a corresponding error.

## Install Dependencies

If you have just cloned this template, you should install the project dependencies using the
command:

```Bash
pnpm install
```

## Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using self-signed SSL certificate.
- `build`. Builds the application for production.
- `start`. Starts the Next.js server in production mode.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets the required
  standards.
- `deploy`. Starting the build of the project, and in the case of a successful build, 
  all commits will be pushed to the origin repository

To run a script, use the `pnpm run` command:

```Bash
pnpm run {script}
# Example: pnpm run build
```

## Run

To run the application in the development mode, use the `dev` script:

```bash
pnpm run dev
```

After this, you will see a similar message in your terminal:

```bash
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Starting...
✓ Ready in 2.9s
```

To view the application, you need to open the `Local`
link (`http://localhost:3000` in this example) in your browser.
