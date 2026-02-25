<div align="center">
<img width="1200" height="475" alt="GBA Shell Studio Banner" src="https://godsaftigochdryg.se/gbashellstudio/gbashellstudio.png" />

# GBA Shell Studio

**The ultimate visualizer for Game Boy Advance & Color shell and button customizations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg)](https://vitejs.dev/)

[Live Demo](https://gba-shell-studio.com/) • [Report Bug](https://github.com/ReTeeRetro/GBA-Shell-Studio/issues) • [Request Feature](https://github.com/ReTeeRetro/GBA-Shell-Studio/issues)

</div>

---

## 🎮 About The Project

GBA Shell Studio is a web-based customization tool designed for the retro gaming community. Whether you're planning your next hardware mod or just dreaming of the perfect aesthetic, this studio allows you to visualize thousands of color combinations for the Game Boy Advance and Game Boy Color.

### Key Features

- **Dual Console Support**: Switch seamlessly between GBA and GBC layouts.
- **High-Fidelity Visuals**: SVG-based rendering with support for clear/transparent shells and internal components (PCBs, membranes).
- **Shop Mode**: Restrict color palettes to real-world inventory from popular modding stores like **FunnyPlaying**, **Retro Game Repair Shop**, and **SilentModding**.
- **AI Visualization**: Generate high-quality prompts for ChatGPT or Gemini to see photorealistic renders of your design.
- **Export & Share**: Download high-resolution PNGs of your designs with detailed color specs, or share your configuration via unique URLs.
- **Undo/Redo System**: Experiment freely with a full history of your changes.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) / [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ReTeeRetro/GBA-Shell-Studio.git
   cd GBA-Shell-Studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

The project is configured for easy deployment to GitHub Pages:

```bash
npm run deploy
```

Alternatively, it can be deployed to Vercel or Netlify by simply connecting your repository.

## 🗺️ Roadmap & Future Plans

I have many ideas for where to take this studio next! Here is what's on my radar for future updates:

### 🎨 Visual & Realism Improvements
- [ ] **Better Clear Materials**: Enhance the shaders for clear/transparent buttons to make them more visually interesting.
- [ ] **Shell Details**: Add missing markings like the Nintendo logo, Start/Select text, and an improved Power LED/switch marking.
- [ ] **Enhanced Shop Mode**: Add supplier-specific logos to lenses and parts, rather than just disabling them.
- [ ] **Photorealism Exploration**: Investigating if the render should move towards a more photorealistic style or keep the clean "vector" look.

### 🕹️ Customization & Hardware
- [ ] **Flip the Console**: Add the ability to view the back of the GBA (battery cover, stickers, etc.).
- [ ] **Alternative Materials**: Support for buttons in metal, resin, and other custom materials.
- [ ] **Visual Effects**: Add support for UV-printed shells and advanced textures (Glow in the dark, Sparkle).
- [ ] **Mod Visualizers**: Add "Button LED mods" to see how different colors look with internal lighting.

### ⚡ User Experience (UX)
- [ ] **Direct Click Interaction**: Allow users to click directly on a part of the GBA to open its color picker.

Have a suggestion or want to help? Feel free to open a [Feature Request](https://github.com/ReTeeRetro/GBA-Shell-Studio/issues)!

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💖 Acknowledgments

- Inspired by the incredible retro modding community.
- Not affiliated with Nintendo. Game Boy is a trademark of Nintendo Co., Ltd.

---

<div align="center">
Built with ❤️ by <a href="https://www.gba-shell-studio.com">ReTee Retro</a>
</div>