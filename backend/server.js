require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { execFile } = require("child_process");
const { promisify } = require("util");

const app = express();
const execFileAsync = promisify(execFile);

app.use(express.json());

app.get("/api/kubernetes", async (req, res) => {
    try {
        const { stdout } = await execFileAsync("kubectl", [
            "get", "pods", "-o", "json"
        ]);

        const data = JSON.parse(stdout);

        const pods = data.items.map(pod => ({
            name: pod.metadata.name,
            status: pod.status.phase,
            ready: (pod.status.containerStatuses || [])
                .every(container => container.ready),
            restarts: (pod.status.containerStatuses || [])
                .reduce((total, container) => total + container.restartCount, 0)
        }));

        res.json({
            success: true,
            totalPods: pods.length,
            runningPods: pods.filter(pod => pod.status === "Running").length,
            pods
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.get("/api/jenkins", async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.JENKINS_URL}/job/projet-devops-nginx/lastBuild/api/json`,
            {
                params: {
                    tree: "number,result,building,duration,url,timestamp"
                },
                auth: {
                    username: process.env.JENKINS_USER,
                    password: process.env.JENKINS_TOKEN
                }
            }
        );

        res.json({
            success: true,
            build: response.data
        });

    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.status
                ? `Jenkins HTTP ${error.response.status}`
                : error.message
        });
    }
});
app.get("/", (req, res) => {
    res.send("DevOps Dashboard Backend is running!");
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
});

const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});
