# Guess Competition Game

Auto competitions between two Express servers

## Live Demo

[Play on GitHub Pages](https://hblee12294.github.io/guess-competition) - No backend required!

## Start (Local Development with Backend Servers)

1. Enter program root directory  
   `cd /guess-competition`

2. Install dependencies  
   `npm install`

3. Start servers in **two terminal windows**  
   `npm run alfred`  
   `npm run barbara`

4. Start React server  
   `npm start`

## GitHub Pages Deployment

The app can run entirely in the browser without backend servers using simulation mode.

### Manual Deploy

```bash
npm run deploy
```

This will build the app with simulation mode enabled and deploy to GitHub Pages.

### Automatic Deploy

Push to `main` or `master` branch triggers automatic deployment via GitHub Actions.

### Local Simulation Testing

```bash
REACT_APP_SIMULATION_MODE=true npm start
```

## Mode

**Normal mode** - With typing effect like real-time competitions.

**Quick mode** - No typing effect. Results come fast.
