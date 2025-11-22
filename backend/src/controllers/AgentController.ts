import { Request, Response } from "express";
import { AnalystAgent } from "../application/agents/AnalystAgent";

export class AgentController {
    private analyst: AnalystAgent;

    constructor() {
        this.analyst = new AnalystAgent();
    }

    analyze = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const report = await this.analyst.analyze(userId);
            res.json(report);
        } catch (error) {
            console.error("Error in Agent analysis:", error);
            res.status(500).json({ error: "Failed to generate analysis" });
        }
    };
}
