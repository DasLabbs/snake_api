import config from "@config/index";
import { SUPERVISORS } from "@shared/constant/config";
import { createObjectCsvStringifier } from "csv-writer";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";

// Function to convert data to CSV
async function createCSV(data: object[], filePath: string) {
    const csvStringifier = createObjectCsvStringifier({
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });

    const csvData =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(data);
    await fs.writeFile(filePath, csvData, "utf8");
}

async function sendEmailWithCSV(filePath: string, to: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.mailUserName,
            pass: config.mailPassword,
        },
    });

    const mailOptions = {
        from: config.mailUserName,
        to,
        subject: "Snake game weekly ranking report",
        text: `
Dear,

I hope this email finds you well.

Please find attached the weekly leaderboard report for Lunar snake game. The file includes the detailed ranking and performance metrics of users for the past week.

If you have any questions or need further details, feel free to reach out.

Best regards,
Daslab Team`,
        attachments: [
            {
                filename: path.basename(filePath),
                path: filePath,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
}

export const sendMail = async (data: object[]) => {
    const filePath = path.join(__dirname, "data.csv");
    try {
        await createCSV(data, filePath);
        for (const to of SUPERVISORS) {
            await sendEmailWithCSV(filePath, to);
        }
        console.log("Process completed.");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Clean up the CSV file
        await fs
            .unlink(filePath)
            .catch(() => console.error("Error deleting file."));
    }
};
