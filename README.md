1. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

To run the application locally:

```bash
npm run dev
# or
npm run start
```

### Deploying

Push to `main`: GitHub Actions builds the image and deploys it to the VPS from
`deploy/docker-compose.yaml`. Details and the manual fallback are in `CLAUDE.md` → Deployment.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

