# My YouTube - RSS Feed Reader

A Svelte application that aggregates YouTube RSS feeds into a clean, responsive video grid interface.

## Features

- **Configuration via YAML**: Load YouTube RSS feed URLs from `subscriptions.yaml`
- **Feed Fetch and Refresh**: Automatically fetch videos on startup with manual refresh capability
- **Video Grid Display**: Responsive grid showing thumbnails, titles, channel names, and publish dates
- **Smart Sorting**: Videos automatically sorted by publish date (newest first)
- **Clean UI**: Modern, responsive design with loading indicators and error handling

## Configuration

The app reads from a `subscriptions.yaml` file in the project root. Simply add the YouTube channel IDs you want to follow:

```yaml
feeds:
  - UC-lHJZR3Gqxm24_Vd_AJ5Yw
  - UCX6OQ3DkcsbYNE6H8uQQuVA
  - UCbRP3c757lWg9M-U7TyEkXA
```

### How to Find Channel IDs

1. **From YouTube URL**: When viewing a YouTube channel, the URL will contain the channel ID:
   - `https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw`
   - The channel ID is: `UC-lHJZR3Gqxm24_Vd_AJ5Yw`

2. **From Channel Page**: Look at the channel's "About" page or inspect the page source

3. **From RSS Feed**: If you already have an RSS feed URL, extract the channel ID from:
   - `https://www.youtube.com/feeds/videos.xml?channel_id=UC-lHJZR3Gqxm24_Vd_AJ5Yw`
   - The channel ID is: `UC-lHJZR3Gqxm24_Vd_AJ5Yw`

The app automatically constructs the full RSS feed URLs from these channel IDs, making your configuration much cleaner and easier to manage!

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
