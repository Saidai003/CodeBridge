export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/lander/', // 👈 Cambia la barra sola '/' por '/lander/'
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
