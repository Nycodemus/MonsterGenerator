# D&D Monster Generator

A Vue.js application that generates custom D&D 5e monsters based on descriptions, complete with stat blocks and AI-generated images.

## Features

- Generate custom D&D 5e monsters with complete stat blocks
- AI-powered image generation for monsters using DALL-E 3
- Party composition consideration for balanced encounters
- Customizable Challenge Rating ranges
- Encounter difficulty selection
- Detailed encounter analysis and tactical considerations

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dnd-monster-generator.git
cd dnd-monster-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```bash
VITE_OPENAI_API_KEY=your_api_key_here
```

## Development

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- Vue.js 3
- Vuetify 3
- Vite
- OpenAI API (GPT-3.5-turbo and DALL-E 3)
- TypeScript

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT and DALL-E APIs
- Vue.js team for the amazing framework
- Vuetify team for the UI components
