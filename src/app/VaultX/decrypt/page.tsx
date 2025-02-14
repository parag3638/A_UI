"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Copy } from "lucide-react"; // Import download icon

type DecryptedFile = {
    name: string;
    downloadLink: string;
};



export default function Dash() {
    const [filename, setFilename] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [decryptedFiles, setDecryptedFiles] = useState<DecryptedFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Handle file decryption
    const handleDecrypt = async () => {
        if (!filename || !password) {
            setError("Please enter the filename and password.");
            return;
        }

        setLoading(true);
        setError(null);

        const token = Cookies.get("token");

        try {
            const response = await axios.post(
                "https://abnormal-backend.onrender.com/api/decrypt",
                { filename, password },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Decryption successful:", response.data);
            const newFile = {
                name: response.data.decryptedFile,
                downloadLink: `https://abnormal-backend.onrender.com/api/decrypted/${response.data.decryptedFile}`,
            };

            // ✅ Add to decrypted files list
            setDecryptedFiles((prevFiles) => [...prevFiles, newFile]);

        } catch (err) {
            console.error("❌ Decryption error:", err);
            setError("Failed to decrypt the file. Check the filename and password.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Copy link to clipboard
    const copyToClipboard = (link: string) => {
        navigator.clipboard.writeText(link);
        alert("🔗 Link copied to clipboard!");
    };

    return (
        <div className="p-6">
            <div className="font-semibold text-xl mb-5">File Decryption</div>

            {/* 🔹 Enter Filename & Password */}
            <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="filename">Encrypted Filename</Label>
                <Input
                    id="filename"
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="example.pdf.enc"
                />

                <Label htmlFor="password">Decryption Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="mt-2" onClick={handleDecrypt} disabled={loading}>
                    {loading ? "Decrypting..." : "Decrypt File"}
                </Button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Separator className="my-5" />

            {/* 🔹 Display Decrypted Files in Table */}
            {decryptedFiles.length > 0 && (
                <div>
                    <h2 className="font-semibold text-xl mb-3">Decrypted Files</h2>
                    <Table className="w-full max-w-3xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead className="text-center">Download</TableHead>
                                <TableHead className="text-center">Share Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {decryptedFiles.map((file, index) => (
                                <TableRow key={index}>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell className="text-center">
                                        <a href={file.downloadLink} target="_blank" download>
                                            <Button variant="outline">
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" onClick={() => copyToClipboard(file.downloadLink)}>
                                            <Copy className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
