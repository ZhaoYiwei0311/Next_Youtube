# Next_Youtube 🎬

A modern, full-stack [Next.js](https://nextjs.org) project inspired by YouTube, built to showcase real-time video streaming, AI-powered features, and scalable cloud architecture.

## 🚀 Getting Started (Local Development)

To start the development server:

```bash
bun run dev:all
```

Then open your browser and visit:  
👉 [http://localhost:3000](http://localhost:3000)

> You can begin development by editing the `app/page.tsx` file. The page supports **hot reload**, so changes will reflect instantly.

## 🛠️ Tech Stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Frontend   | [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) |
| Backend    | [tRPC](https://trpc.io), Next.js API Routes |
| Database   | PostgreSQL, Redis                      |
| Media      | [Mux](https://www.mux.com/) (Video hosting & streaming) |
| Webhooks   | [Ngrok](https://ngrok.com)             |
| Cloud      | [Vercel](https://vercel.com)           |
| AI         | [OpenAI API](https://platform.openai.com) |

## 🌐 Live Demo

The project is live on Vercel:  
👉 [next-youtube.vercel.app](https://next-youtube-5h8q-bgp2z9tpy-yiweizhao0311s-projects.vercel.app/)

## 🖋️ Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization.  
It includes the [Geist](https://vercel.com/font) font by Vercel for a clean, modern look.

## 📦 Deployment on Vercel

To deploy this project to Vercel:

1. Push your code to GitHub/GitLab.
2. Connect your repository on [Vercel Dashboard](https://vercel.com).
3. Set build command (in project settings):
   ```
   Build Command: bun run build
   Install Command: bun install
   ```

---

### 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

### 📄 License

[MIT](LICENSE)

---

Made with ❤️ by YiweiZhao0311