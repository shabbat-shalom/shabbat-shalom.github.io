# 🕯️ Shabbat Times - Jewish Times (JTimes)

A modern, beautiful Progressive Web App (PWA) for finding accurate Shabbat times and Zmanim for any location.

## ✨ Features

### 🎨 Modern Design

- **Contemporary UI**: Clean, modern interface with smooth animations and transitions
- **Beautiful Gradients**: Stunning purple-blue gradient backgrounds
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Smooth Animations**: Elegant slide-in and fade effects throughout
- **Modern Typography**: Inter and Playfair Display fonts for a sophisticated look

### 📱 Progressive Web App (PWA)

- **Installable**: Install as a standalone app on any device
- **Offline Support**: Core functionality works without internet connection
- **Fast Performance**: Service worker caching for instant loading
- **App Shortcuts**: Quick access to Shabbat times and marketplace
- **Push Notifications**: (Ready for future implementation)
- **Background Sync**: (Ready for future implementation)

### 🔍 Shabbat Times Functionality

- **Zip Code Search**: Find times by entering a US zip code
- **Geolocation**: Automatically detect your current location
- **Accurate Times**: Powered by Hebcal API for reliable data
- **Copy to Clipboard**: Easy sharing of times
- **Visual Indicators**: Color-coded candle lighting, Havdalah, and Parashat times

### 🛒 Marketplace

- **Beautiful Product Grid**: Modern card-based layout
- **Hover Effects**: Interactive product cards with smooth animations
- **Essential Items**: Shabbat candles, Kiddush cups, challah covers, and more
- **Responsive Grid**: Adapts to screen size (1, 2, or 3 columns)

### ♿ Accessibility

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Support**: Respects user preferences
- **Reduced Motion**: Honors prefers-reduced-motion settings
- **Focus Indicators**: Clear focus states for all interactive elements

## 🚀 Technical Features

### Performance

- **Optimized Loading**: Preconnect to external resources
- **Image Lazy Loading**: Images load as needed
- **Efficient Caching**: Smart service worker strategies
- **Code Splitting**: Minimal initial load time

### PWA Capabilities

- **Service Worker**: Advanced caching with multiple strategies
  - Network First: For API requests
  - Cache First: For static assets
  - Stale While Revalidate: For HTML pages
- **Offline Page**: Beautiful fallback when offline
- **Install Prompt**: Custom install button with user feedback
- **Online/Offline Detection**: Status notifications
- **Auto-Update**: Checks for updates when app is focused

### SEO & Social

- **Open Graph Tags**: Beautiful sharing on social media
- **Twitter Cards**: Rich previews on Twitter
- **Structured Metadata**: Proper meta tags for search engines
- **Sitemap Ready**: Easy to index by search engines

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **iOS Safari**: Full PWA support
- **Android Chrome**: Complete PWA experience
- **Fallback Support**: Graceful degradation for older browsers

## 📦 Installation

### As a Website

Simply visit the site in your web browser. No installation needed!

### As a PWA

1. Visit the website on your device
2. Look for the "Install App" button or browser prompt
3. Click "Install" to add to your home screen
4. Launch like any native app

#### iOS (Safari)

1. Tap the Share button
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add"

#### Android (Chrome)

1. Tap the menu button (⋮)
2. Tap "Add to Home screen" or "Install app"
3. Tap "Install"

#### Desktop (Chrome/Edge)

1. Click the install icon in the address bar
2. Click "Install"

## 🛠️ Development

### File Structure

```
shabbat-shalom.github.io/
├── index.html              # Main page with Shabbat times
├── market.html             # Marketplace page
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker
├── app.js                  # PWA install logic
├── css/
│   └── styles.css          # Modern styles
├── assets/                 # Images and resources
├── pyth/                   # Python utilities
└── README.md              # This file
```

### Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, Grid, Flexbox
- **JavaScript ES6+**: Modern JavaScript features
- **Service Workers**: PWA functionality and caching
- **Hebcal API**: Shabbat times data
- **Google Fonts**: Inter & Playfair Display
- **Boxicons**: Beautiful icon library

### Color Palette

- **Primary**: `#0038b8` (Deep Blue)
- **Secondary**: `#6366f1` (Indigo)
- **Accent**: `#f59e0b` (Amber)
- **Success**: `#10b981` (Green)
- **Error**: `#ef4444` (Red)

### Custom CSS Properties

The design system uses CSS custom properties for:

- Colors (primary, secondary, neutrals)
- Spacing (xs to 2xl)
- Typography (font families and weights)
- Borders (radius sizes)
- Shadows (elevation system)
- Transitions (timing functions)

## 🎯 Best Practices

### Performance

- ✅ Optimized images
- ✅ Efficient caching strategies
- ✅ Minimal JavaScript
- ✅ Fast First Contentful Paint
- ✅ Smooth 60fps animations

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast ratios

### PWA

- ✅ HTTPS required
- ✅ Responsive design
- ✅ Service worker
- ✅ Web app manifest
- ✅ Offline functionality

## 📊 Browser Compatibility

| Feature        | Chrome | Firefox | Safari | Edge |
| -------------- | ------ | ------- | ------ | ---- |
| Core App       | ✅     | ✅      | ✅     | ✅   |
| Service Worker | ✅     | ✅      | ✅     | ✅   |
| Install Prompt | ✅     | ❌      | ✅\*   | ✅   |
| Offline Mode   | ✅     | ✅      | ✅     | ✅   |
| Geolocation    | ✅     | ✅      | ✅     | ✅   |

\*Safari uses "Add to Home Screen" instead of install prompt

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] Push notifications for Shabbat reminders
- [ ] Background sync for automatic updates
- [ ] Multi-language support (Hebrew, Yiddish)
- [ ] Custom candle lighting times
- [ ] Save favorite locations
- [ ] Weekly Parsha information
- [ ] Holiday calendar
- [ ] Zmanim widgets

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a community project. Contributions are welcome!

## 📞 Contact

- **Website**: [shabbat-shalom.github.io](https://shabbat-shalom.github.io)
- **Instagram**: [@jtimesorg](https://www.instagram.com/jtimesorg/)
- **Twitter**: [@jtimesorg](https://x.com/jtimesorg)

## 🙏 Acknowledgments

- **Hebcal**: For providing the Shabbat times API
- **Boxicons**: For the beautiful icon library
- **Google Fonts**: For Inter and Playfair Display fonts
- **Community**: For support and feedback

---

Made with ❤️ for the Jewish community

**Shabbat Shalom!** 🕯️✨
