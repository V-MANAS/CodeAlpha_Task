import {prisma} from "../configs/prisma.js";

// Get all workspaces for user
export const getUserWorkspaces = async (req, res) => {
    try {
        const auth = await req.auth();
        if (!auth?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { userId } = auth;

        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: {
                            include: {
                                assignee: true,
                                comments: {
                                    include: { user: true }
                                }
                            }
                        },
                        members: { include: { user: true } }
                    }
                },
                owner: true
            }
        });

        res.json({ workspaces });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Add member to workspace
export const addMember = async (req, res) => {
    try {
        const auth = await req.auth();
        if (!auth?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { userId } = auth;
        const { email, role, workspaceId, message } = req.body;

        if (!email || !workspaceId || !role) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        if (!["ADMIN", "MEMBER"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: true }
        });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isAdmin = workspace.members.find(
            member => member.userId === userId && member.role === "ADMIN"
        );

        if (!isAdmin) {
            return res.status(403).json({ message: "Admin privileges required" });
        }

        const existingMember = workspace.members.find(
            member => member.userId === user.id
        );

        if (existingMember) {
            return res.status(409).json({ message: "User is already a member" });
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role,
                message
            }
        });

        res.json({ member, message: "Member added successfully!!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
