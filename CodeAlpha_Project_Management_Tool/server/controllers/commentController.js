import { prisma } from "../configs/prisma.js";

// Add comments
export const addComments = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { content, taskId } = req.body;

    // 1️⃣ Get task first
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    // 2️⃣ Get project using task.projectId
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { members: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found!" });
    }

    // 3️⃣ Check membership SAFELY
    const member = project.members.find(
      (m) => m.userId === userId
    );

    if (!member) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project!" });
    }

    // 4️⃣ Create comment
    const comment = await prisma.comment.create({
      data: {
        taskId,
        content,
        userId,
      },
      include: { user: true },
    });

    res.json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Get comments for individual task
export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { user: true },
    });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
