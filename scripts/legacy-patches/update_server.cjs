const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf-8');

if (!serverCode.includes('import http from "http"')) {
  serverCode = serverCode.replace(
    'import { createServer as createViteServer } from "vite";',
    'import { createServer as createViteServer } from "vite";\nimport http from "http";\nimport { Server } from "socket.io";'
  );

  const socketLogic = `
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join_sim", (room) => {
      socket.join(room);
      const clients = io.sockets.adapter.rooms.get(room)?.size || 1;
      io.to(room).emit("user_count", clients);
    });

    socket.on("sim_param_change", ({ room, params }) => {
      socket.to(room).emit("sim_param_update", params);
    });

    socket.on("cursor_move", ({ room, cursor }) => {
      socket.to(room).emit("remote_cursor", { id: socket.id, cursor });
    });
    
    socket.on("disconnect", () => {
       // Optional cleanup
    });
  });
  `;

  serverCode = serverCode.replace(
    'const app = express();\n  const PORT = 3000;',
    'const app = express();\n  const PORT = 3000;\n' + socketLogic
  );

  serverCode = serverCode.replace(
    'app.listen(PORT',
    'httpServer.listen(PORT'
  );

  fs.writeFileSync('server.ts', serverCode);
}
