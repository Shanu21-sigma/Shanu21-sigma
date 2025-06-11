# BackSnap - One-Click Background Remover

BackSnap is a professional AI-powered background removal tool that delivers studio-grade results in seconds. Built with React, TypeScript, and Tailwind CSS, it provides a seamless user experience for removing backgrounds from images.

## ✨ Features

- **One-Click Background Removal**: Remove backgrounds instantly with advanced AI
- **High-Quality Results**: Professional studio-grade output
- **Fast Processing**: Results in seconds, not minutes
- **Privacy First**: Images are processed securely and never stored
- **Rate Limiting**: Built-in protection with 20 requests per day per user
- **Mobile Responsive**: Works perfectly on all devices
- **Modern UI**: Beautiful dark-mode interface with frosted glass effects

## 🚀 Get Started in 2 Minutes

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backsnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` and start removing backgrounds!

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API**: Clipdrop Remove Background API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero section
│   ├── ImageProcessor.tsx # Main image processing component
│   ├── DropZone.tsx    # File upload area
│   ├── ImagePreview.tsx # Before/after image display
│   ├── ProgressBar.tsx # Processing progress indicator
│   ├── SampleImages.tsx # Sample results showcase
│   └── Footer.tsx      # Site footer
├── services/           # API services
│   └── clipdropApi.ts  # Clipdrop API integration
├── utils/              # Utility functions
│   └── rateLimit.ts    # Client-side rate limiting
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🎯 Core Features

### Image Processing
- Supports JPG and PNG formats
- Maximum file size: 10MB
- Maximum resolution: 25 megapixels
- Real-time progress tracking

### Rate Limiting
- 20 background removals per day per user
- Client-side tracking using localStorage
- Clear error messages when limits are reached

### User Experience
- Drag-and-drop file upload
- Before/after image comparison
- One-click download of processed images
- Responsive design for all screen sizes

## 🔧 Configuration

The app uses the Clipdrop API for background removal. The API key is configured in `src/services/clipdropApi.ts`.

### Environment Variables (Optional)

You can optionally use environment variables for the API key:

```bash
VITE_CLIPDROP_API_KEY=your_api_key_here
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Set up redirects for SPA routing (optional)

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

## 📱 PWA Features

BackSnap includes Progressive Web App features:

- **Manifest**: App can be installed on mobile devices
- **Offline Page**: Graceful handling when offline
- **Service Worker Ready**: Easy to extend with caching strategies

## 🎨 Customization

### Styling
- Built with Tailwind CSS for easy customization
- Custom glass-morphism components
- Gradient backgrounds and hover effects
- Dark mode optimized

### Rate Limits
Adjust rate limits in `src/utils/rateLimit.ts`:

```typescript
const MAX_REQUESTS_PER_DAY = 20; // Change this value
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Clipdrop API](https://clipdrop.co/apis) for the background removal service
- [Pexels](https://pexels.com) for sample images
- [Lucide](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact support at support@backsnap.com

---

**Made with ❤️ by the BackSnap team**