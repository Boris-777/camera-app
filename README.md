# Camera App

A React application that automatically takes a photo using your device's front camera and sends it to a Telegram bot.

## Deployment Instructions

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Important Notes

1. Make sure to replace `yourusername` in the `homepage` field of `package.json` with your actual GitHub username.

2. The application requires:
   - HTTPS or localhost to access the camera
   - Camera permissions from the browser
   - A valid Telegram bot token and chat ID

3. For GitHub Pages deployment:
   - Make sure your repository is public
   - Enable GitHub Pages in your repository settings
   - Select the `gh-pages` branch as the source

## Troubleshooting

If the page is blank or shows an error:
1. Check the browser console for errors
2. Verify that the camera permissions are granted
3. Ensure the Telegram bot token and chat ID are correct
4. Make sure the repository is public and GitHub Pages is properly configured 