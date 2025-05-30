# SvelteKit to AWS Amplify Deployment Guide

A comprehensive step-by-step guide to deploy any SvelteKit application to AWS Amplify with Server-Side Rendering (SSR) support.

## Overview

This guide walks you through configuring a SvelteKit application for AWS Amplify deployment using the Node.js adapter. AWS Amplify supports SvelteKit SSR through a custom deployment structure that separates static assets from compute resources.

## Prerequisites

- A working SvelteKit application running locally
- Node.js 18 or later
- An AWS account
- A GitHub repository (for automated deployment)

## Step 1: Install Required Dependencies

Install the Node.js adapter and build dependencies:

```bash
npm install @sveltejs/adapter-node dotenv @vercel/nft
npm install -D prepend-file
```

### Dependencies Explained:
- `@sveltejs/adapter-node`: Enables SvelteKit SSR on Node.js runtime
- `dotenv`: Handles environment variables in production
- `@vercel/nft`: Traces and bundles Node.js dependencies
- `prepend-file`: Helper for modifying build output

## Step 2: Update SvelteKit Configuration

Update your `svelte.config.js` file to use the Node.js adapter:

```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter()
	}
};

export default config;
```

### Why This Change:
- Replaces `@sveltejs/adapter-auto` with the specific Node.js adapter
- Ensures consistent SSR behavior on AWS Lambda
- Provides better control over the build output

## Step 3: Create Amplify Build Script

Create a file named `amplify.mjs` in your project root:

```javascript
import { join } from 'node:path'
import { nodeFileTrace } from '@vercel/nft'
import { sync as prependSync } from 'prepend-file'
import { writeFileSync, mkdirSync, existsSync, cpSync, rmSync } from 'node:fs'

// Define all the Amplify related directories
const amplifyDirectories = [
  join(process.cwd(), '.amplify-hosting'),
  join(process.cwd(), '.amplify-hosting', 'static'),
  join(process.cwd(), '.amplify-hosting', 'compute'),
  join(process.cwd(), '.amplify-hosting', 'compute', 'default'),
  join(process.cwd(), '.amplify-hosting', 'compute', 'default', 'node_modules'),
]

// Create directories if they do no exist already
if (existsSync(amplifyDirectories[0])) rmSync(amplifyDirectories[0], { force: true, recursive: true })

// Create directories if they do no exist already
amplifyDirectories.forEach((i) => mkdirSync(i))

const deployManifestConfig = {
  version: 1,
  routes: [
    {
      path: `/assets/*`,
      target: {
        kind: 'Static',
      },
    },
    {
      path: `/*.*`,
      target: {
        kind: 'Static',
      },
      fallback: {
        kind: 'Compute',
        src: 'default',
      },
    },
    {
      path: '/*',
      target: {
        kind: 'Compute',
        src: 'default',
      },
    },
  ],
  computeResources: [
    {
      name: 'default',
      runtime: 'nodejs18.x',
      entrypoint: 'build/index.js',
    },
  ],
  framework: {
    name: 'sveltekit',
    version: '2.16.0', // Update this to match your SvelteKit version
  },
}

// Write the config to .amplify-hosting/deploy-manifest.json
writeFileSync(join(process.cwd(), '.amplify-hosting', 'deploy-manifest.json'), JSON.stringify(deployManifestConfig))

// Move the build/client to the static directory for Amplify
cpSync(join(process.cwd(), 'build', 'client'), amplifyDirectories[1], { recursive: true })

// Compute and copy runtime dependencies
async function computeDependencies(paths = []) {
  const files = paths
  const { fileList } = await nodeFileTrace(files)
  let packages = {}
  
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '')
      temp = temp.substring(0, temp.indexOf('/'))
      packages[`node_modules/${temp}`] = true
    } else packages[i] = true
  })
  
  Object.keys(packages)
    .sort()
    .forEach((i) => {
      cpSync(i, join(amplifyDirectories[3], i), { recursive: true })
    })
}

// Prepend dotenv import into the entrypoint
prependSync(join('build', 'index.js'), `import 'dotenv/config'\n`)

// Compute all the dependents on build/index.js and load them into the compute
computeDependencies(['./build/index.js'])
```

### Script Breakdown:
- **Directory Structure**: Creates the required `.amplify-hosting` directory structure
- **Deploy Manifest**: Configures routing between static assets and compute resources
- **Asset Separation**: Moves client-side assets to static directory
- **Dependency Tracing**: Bundles only necessary Node.js dependencies
- **Environment Setup**: Prepends dotenv configuration for environment variables

## Step 4: Create Amplify Build Configuration

Create an `amplify.yml` file in your project root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - env >> .env
        - npm run build
        - node amplify.mjs
  artifacts:
    baseDirectory: .amplify-hosting
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Configuration Explained:
- **preBuild**: Installs dependencies using `npm ci` for reproducible builds
- **build**: 
  - Exports environment variables to `.env` file
  - Runs the SvelteKit build process
  - Executes the custom Amplify preparation script
- **artifacts**: Tells Amplify to deploy from the `.amplify-hosting` directory
- **cache**: Speeds up builds by caching `node_modules`

## Step 5: Update .gitignore

Add the Amplify hosting directory to your `.gitignore`:

```gitignore
# Existing entries...

# AWS Amplify
.amplify-hosting
```

This prevents the generated deployment directory from being committed to version control.

## Step 6: Test Local Build

Verify your configuration works locally:

```bash
# Build the SvelteKit application
npm run build

# Run the Amplify preparation script
node amplify.mjs

# Verify the structure was created
ls -la .amplify-hosting
```

You should see:
- `static/` - Contains client-side assets
- `compute/` - Contains server-side code and dependencies
- `deploy-manifest.json` - Routing configuration

## Step 7: Deploy to AWS Amplify

### Option A: Automatic GitHub Deployment

1. **Push to GitHub**: Commit and push your configured code to a GitHub repository

2. **Create Amplify App**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "Create new app" → "Host web app"
   - Select GitHub as your repository provider
   - Authorize AWS Amplify to access your repositories

3. **Configure Repository**:
   - Select your repository
   - Choose the branch to deploy (usually `main` or `master`)
   - Click "Next"

4. **Build Settings**:
   - App name: Choose a name for your application
   - Build settings: The `amplify.yml` will be automatically detected
   - Environment variables: Add any required environment variables
   - Click "Next"

5. **Review and Deploy**:
   - Review your settings
   - Click "Save and deploy"

### Option B: Manual ZIP Upload

If you prefer not to use GitHub integration:

1. Run the build process locally:
   ```bash
   npm run build
   node amplify.mjs
   ```

2. Create a ZIP file of the `.amplify-hosting` directory

3. In the Amplify Console:
   - Choose "Deploy without Git provider"
   - Upload your ZIP file

## Step 8: Configure Environment Variables (Optional)

If your application uses environment variables:

1. In the Amplify Console, navigate to your app
2. Go to "App settings" → "Environment variables"
3. Add your environment variables:
   - `NODE_ENV=production`
   - Any custom variables your app requires
4. Redeploy the application

## Troubleshooting

### Common Issues:

**Build Failures**:
- Ensure all dependencies are installed with exact versions
- Check that your SvelteKit version matches the version in `amplify.mjs`
- Verify that `build/index.js` exists after running `npm run build`

**Runtime Errors**:
- Check CloudWatch logs in the AWS Console
- Ensure environment variables are properly configured
- Verify that all dependencies are included in the compute bundle

**Static Asset Issues**:
- Confirm that client assets are correctly moved to the static directory
- Check that the routing configuration in the deploy manifest is correct

### Useful Commands:

```bash
# Clean build artifacts
rm -rf build .amplify-hosting

# Full rebuild and test
npm run build && node amplify.mjs

# Check deployment structure
tree .amplify-hosting
```

## Performance Considerations

- **Bundle Size**: The `@vercel/nft` tracer only includes necessary dependencies
- **Caching**: Static assets are served with optimal caching headers
- **Cold Starts**: Lambda functions may have cold start delays for infrequent requests
- **Monitoring**: Use AWS CloudWatch to monitor performance and errors

## Security Best Practices

- Never commit `.env` files or sensitive environment variables
- Use AWS Systems Manager Parameter Store for sensitive configuration
- Regularly update dependencies to patch security vulnerabilities
- Configure appropriate IAM roles and permissions

## Next Steps

- Set up custom domains through the Amplify Console
- Configure SSL certificates (handled automatically by Amplify)
- Set up branch-based deployments for different environments
- Implement monitoring and alerting for production applications

---

This guide provides a complete, reusable process for deploying any SvelteKit application to AWS Amplify with SSR support. The configuration is production-ready and follows AWS best practices for serverless deployments. 