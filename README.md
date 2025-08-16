# My YouTube - RSS Feed Reader

A Svelte application that aggregates YouTube RSS feeds into a clean, responsive video grid interface.

## Features

- **Configuration via YAML**: Load YouTube RSS feed URLs from `subscriptions.yaml`
- **Feed Fetch and Refresh**: Automatically fetch videos on startup with manual refresh capability
- **Video Grid Display**: Responsive grid showing thumbnails, titles, channel names, and publish dates
- **Smart Sorting**: Videos automatically sorted by publish date (newest first)
- **Clean UI**: Modern, responsive design with loading indicators and error handling

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure your feeds**:
   Edit `subscriptions.yaml` in the project root to include your YouTube RSS feed URLs:
   ```yaml
   feeds:
     - https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID_1
     - https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID_2
   ```

3. **Find YouTube Channel IDs**:
   - Go to any YouTube channel
   - View page source (Ctrl+U or Cmd+U)
   - Search for `"channelId":"` - the value after this is your channel ID
   - Or use browser dev tools to inspect the page

## Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## How It Works

1. **Startup**: The app loads `subscriptions.yaml` and fetches all configured RSS feeds
2. **Parsing**: RSS feeds are parsed to extract video metadata (title, link, thumbnail, channel, publish date)
3. **Display**: Videos are displayed in a responsive grid, sorted by publish date
4. **Refresh**: Click the "Refresh Feeds" button to manually update all feeds

## Technical Details

- **Frontend**: Svelte with TypeScript
- **RSS Parsing**: `rss-parser` library for XML/RSS feed handling
- **Configuration**: YAML configuration using `js-yaml`
- **Styling**: CSS Grid for responsive layout with custom CSS
- **Error Handling**: Comprehensive error handling with user-friendly messages

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── VideoCard.svelte      # Individual video display component
│   │   └── LoadingSpinner.svelte # Loading indicator component
│   ├── feedService.ts            # RSS feed fetching and parsing logic
│   └── types.ts                  # TypeScript type definitions
├── routes/
│   └── +page.svelte             # Main application page
└── app.css                      # Global styles
```

## Customization

- **Add more feeds**: Simply add more URLs to `subscriptions.yaml`
- **Styling**: Modify CSS in component files or `app.css`
- **Video display**: Customize the `VideoCard.svelte` component
- **Feed parsing**: Extend `feedService.ts` for additional RSS feed formats

## Troubleshooting

- **CORS issues**: Some RSS feeds may have CORS restrictions when running locally
- **Feed errors**: Check that your YouTube RSS URLs are valid and accessible
- **No videos**: Verify your `subscriptions.yaml` format and feed URLs

## License

MIT License - feel free to use and modify as needed.
