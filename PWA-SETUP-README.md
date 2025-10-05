# PWA Setup Complete! ✅

Your Shabbat Times website is now a Progressive Web App (PWA)!

## What Was Added

### 1. **manifest.webmanifest**
- Defines your app's name, colors, icons, and display mode
- Sets theme color to match your site's purple gradient (#667eea)
- Enables standalone mode (full-screen without browser UI)

### 2. **sw.js** (Service Worker)
- Caches all critical assets for offline use
- Enables cache-first strategy with network fallback
- Auto-updates when you deploy new versions (bump cache version)

### 3. **app.js**
- Handles the install prompt for Chrome/Edge on desktop
- Shows the "Install App" button when available
- Note: iOS users install via Share → Add to Home Screen

### 4. **Updated HTML Files**
- Added PWA meta tags to `index.html` and `market.html`
- Added iOS-specific meta tags for standalone mode
- Added service worker registration scripts
- Added install button in hero section

### 5. **Updated CSS**
- Added safe area insets for notched devices (iPhone X+)
- Added styling for install button
- Ensures proper display on all devices

## Testing Your PWA

### Chrome/Edge (Desktop)
1. Open DevTools (F12)
2. Go to **Application** tab → **Manifest**
3. Check for no errors and "Installable" status
4. Click the install icon in the address bar or use the "Install App" button

### Chrome (Android)
1. Visit your site on mobile Chrome
2. Tap menu (⋮) → **Add to Home screen**
3. App will launch in full-screen mode

### Safari (iOS)
1. Visit your site in Safari
2. Tap Share button → **Add to Home Screen**
3. App icon will appear on home screen
4. Opens without Safari UI

### Lighthouse PWA Audit
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Progressive Web App**
4. Click **Generate report**
5. Should pass all installable checks

## Important Notes

### Icon Requirements
⚠️ **ACTION NEEDED**: For best results, create proper icon files:
- Create `icon-192.png` (192×192 pixels)
- Create `icon-512.png` (512×512 pixels)
- Place them in `/assets/` folder
- Currently using your JTimes.png logo, which works but isn't optimized

You can use tools like:
- [PWA Image Generator](https://www.pwabuilder.com/)
- [Real Favicon Generator](https://realfavicongenerator.net/)

### Updating Your PWA
When you deploy new changes:
1. Update the cache version in `sw.js`:
   ```javascript
   const CACHE = "jtimes-cache-v2";  // Increment v1 → v2 → v3, etc.
   ```
2. Add any new files to the `ASSETS` array
3. Deploy your changes

### Offline Functionality
Your PWA will work offline with:
- ✅ Home page
- ✅ Marketplace page
- ✅ All CSS styles
- ✅ All images
- ❌ External APIs (Hebcal) - requires internet

### External Links
All external links (Amazon, social media) will open in the system browser, keeping users in your PWA for internal navigation.

## File Structure
```
/
├── index.html (updated with PWA tags)
├── market.html (updated with PWA tags)
├── manifest.webmanifest (NEW)
├── sw.js (NEW - Service Worker)
├── app.js (NEW - Install handler)
├── css/
│   └── styles.css (updated with safe-area-insets)
└── assets/
    ├── JTimes.png (current icon)
    ├── icon-192.png (recommended to create)
    └── icon-512.png (recommended to create)
```

## Common Issues & Fixes

### Not installable?
- Ensure you're serving over HTTPS (required for service workers)
- GitHub Pages serves HTTPS by default ✅
- Check browser console for any errors

### Stale content after update?
- Increment cache version in `sw.js`
- Clear browser cache or uninstall/reinstall PWA

### Install button not showing?
- This is normal on iOS (use Share menu instead)
- On Chrome, button only shows if PWA is installable
- Check DevTools → Application → Manifest for errors

## Next Steps

1. **Create proper icons** (192x192 and 512x512)
2. **Test on multiple devices** (iOS, Android, Desktop)
3. **Update cache version** when making changes
4. **Monitor service worker** in DevTools during development

## Resources
- [PWA Builder](https://www.pwabuilder.com/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)

---

Your PWA is ready to use! 🎉

Users can now install your app and access Shabbat times offline (for cached data).
