import { Router } from "express";
import prisma from "../db";
import { v4 as uuidv4 } from "uuid";

const app = Router();

app.post("/project-save", async (req, res) => {
  try {
    for (let i = 0; i < req.body.files.length; i++) {
      const obj = req.body.files[i];
      if (obj.id.length == 36) {
        //creating uuid in frontend aand cuid in backend(prisma)
        await prisma.files.create({
          data: {
            filename: obj.filename,
            content: obj.content,
            lang: obj.lang,
            user: {
              connect: {
                id: req.body.projectid,
              },
            },
          },
        });
        continue;
      }
      await prisma.files.update({
        where: {
          id: obj.id,
        },
        data: {
          filename: obj.filename,
          content: obj.content,
          stdin: obj.stdin,
          stdout: obj.stdout,
          stderr: obj.stderr,
          lang: obj.lang,
        },
      });
    }
    return res.send({ success: 1 });
  } catch (error) {
    return res.send({ success: 0, error: error });
  }
});

app.get("/newcompiler/:lang", async (req, res) => {
  try {
    const Id: string = uuidv4().replace(/-/g, "");
    const newId: string = Id.slice(5, 10);
    const lang: string = req.params.lang;
    const filename: string =
      "main." +
      (lang === "python" || lang === "javascript" || lang === "nodejs"
        ? lang === "python"
          ? "py"
          : "js"
        : lang);
    const newUser = await prisma.user.create({
      data: {
        id: newId,
        files: {
          create: {
            filename: filename,
            content: "",
            lang: lang,
          },
        },
      },
      include: {
        files: true,
      },
    });
    return res.send({ success: 1, output: newUser });
  } catch (error: any) {
    const err = error.toString();
    return res.send({ success: 0, error: err });
  }
});

app.get("/code-snippet/:id", async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        id: req.params.id,
      },
      include: {
        files: true,
      },
    });
    if (user.length === 0) {
      throw new Error("No Such Code Snipper Found!");
    }
    return res.send({ success: 1, user: user[0] });
  } catch (error: any) {
    return res.json({ success: 0, error: error });
  }
});

app.get("/clone-snippet/:id", async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        id: req.params.id,
      },
      include: {
        files: true,
      },
    });
    if (user.length === 0) {
      throw new Error("No Such Code Snipper Found!");
    }
    const Id: string = uuidv4().replace(/-/g, "");
    const newId: string = Id.slice(5, 10);
    const newUser = await prisma.user.create({
      data: {
        id: newId,
        files: {
          create: {
            filename: user[0].files[0].filename,
            content: user[0].files[0].content,
            lang: user[0].files[0].lang,
          },
        },
      },
      include: {
        files: true,
      },
    });
    return res.send({ success: 1, output: newUser });
  } catch (error) {
    return res.send({ success: 0, error: error });
  }
});

app.post("/set-password/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        password: req.body.password,
      },
    });

    if (user === null) {
      throw new Error("No Such Code Snipper Found!");
    }
    return res.send({ success: 1, output: user });
  } catch (error) {
    return res.send({ success: 0, error: error });
  }
});
module.exports = app;