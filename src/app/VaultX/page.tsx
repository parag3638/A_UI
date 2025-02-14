// "use client";

// import { useState } from 'react';
// import axios from 'axios';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from '@/components/ui/separator';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";
// import Cookies from "js-cookie";

// export default function Dash() {
//     const [file, setFile] = useState<File | null>(null);
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [files, setFiles] = useState([]);
//     const [error, setError] = useState<string | null>(null);

//     // Handle file selection
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setFile(e.target.files[0]);
//         }
//     };

//     // Upload and encrypt file
//     const handleUpload = async () => {
//         if (!file || !password) {
//             setError("Please select a file and enter a password.");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         const token = Cookies.get("token"); // Get auth token

//         try {
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("password", password);

//             const response = await axios.post("http://localhost:9000/api/encrypt", formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             // console.log("✅ File encrypted:", response.data);
//             alert("File encrypted successfully!");

//             // Reload encrypted files after upload
//             fetchFiles();
//         } catch (err) {
//             console.error("❌ Encryption Error:", err);
//             setError("Failed to encrypt the file. Try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch user's encrypted files
//     const fetchFiles = async () => {
//         setLoading(true);
//         setError(null);

//         const token = Cookies.get("token");

//         try {
//             const response = await axios.get("http://localhost:9000/api/my-files", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setFiles(response.data.files); // Store file list
//             console.log("✅ Fetched files:", response.data.files);
//         } catch (err) {
//             console.error("❌ Error loading files:", err);
//             setError("Failed to load files.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-6">
//             <div className='font-semibold text-xl mb-5'>Encrypter</div>

//             {/* 🔹 File Upload */}
//             <div className="grid w-full max-w-sm items-center gap-2">
//                 <Label htmlFor="file">Select a File</Label>
//                 <Input id="file" type="file" onChange={handleFileChange} />
//                 <Label htmlFor="password">Encryption Password</Label>
//                 <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 <Button className="mt-2" onClick={handleUpload} disabled={loading}>
//                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Encrypt File"}
//                 </Button>
//                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>

//             <Separator className="my-5" />

//             {/* 🔹 Load Files Button */}
//             <div className="flex items-center space-x-5">
//                 <div className="font-semibold text-xl">My Encrypted Files</div>
//                 <Button onClick={fetchFiles} disabled={loading}>
//                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Files"}
//                 </Button>
//             </div>

//             <Separator className="my-5" />

//             {/* 🔹 File List Table */}
//             <Table className="w-full max-w-3xl mt-5">
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>ID</TableHead>
//                         <TableHead>Original Filename</TableHead>
//                         <TableHead>Encrypted Filename</TableHead>
//                         <TableHead>Upload Time</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {files.length > 0 ? (
//                         files.map((file: any) => (
//                             <TableRow key={file.id}>
//                                 <TableCell>{file.id}</TableCell>
//                                 <TableCell>{file.original_filename}</TableCell>
//                                 <TableCell>{file.encrypted_filename}</TableCell>
//                                 <TableCell>{new Date(file.upload_timestamp).toLocaleString()}</TableCell>
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan={4} className="text-center text-gray-500">
//                                 No files found.
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// }




"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Copy, Upload } from "lucide-react"; // Import icons

// ✅ Define a type for encrypted files
type EncryptedFile = {
    id: number;
    original_filename: string;
    encrypted_filename: string;
    upload_timestamp: string;
    downloadLink: string;
};

export default function EncryptedFiles() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState<string>("");
    const [files, setFiles] = useState<EncryptedFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    // 🔹 Upload and encrypt file
    const handleUpload = async () => {
        if (!file || !password) {
            setError("Please select a file and enter a password.");
            return;
        }

        setLoading(true);
        setError(null);

        const token = Cookies.get("token");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", password);

            await axios.post("http://localhost:9000/api/encrypt", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("✅ File encrypted successfully!");
            fetchFiles(); // Reload encrypted files
        } catch (err) {
            console.error("❌ Encryption Error:", err);
            setError("Failed to encrypt the file. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch encrypted files
    const fetchFiles = async () => {
        setLoading(true);
        setError(null);

        const token = Cookies.get("token");

        try {
            const response = await axios.get("http://localhost:9000/api/my-files", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ Map files to include download links
            const encryptedFiles = response.data.files.map((file: any) => ({
                ...file,
                downloadLink: `http://localhost:9000/api/encrypted/${file.encrypted_filename}`,
            }));

            setFiles(encryptedFiles);
            console.log("✅ Fetched encrypted files:", encryptedFiles);

        } catch (err) {
            console.error("❌ Error loading files:", err);
            setError("Failed to load encrypted files.");
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
            <div className="font-semibold text-xl mb-5">Encrypt & Manage Files</div>

            {/* 🔹 File Upload */}
            <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="file">Select a File</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
                <Label htmlFor="password">Encryption Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button className="mt-2" onClick={handleUpload} disabled={loading}>
                    {loading ? "Encrypting..." : "Encrypt File"}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Separator className="my-5" />

            {/* 🔹 Load Files Button */}
            <div className="flex items-center space-x-5">
                <div className="font-semibold text-xl">My Encrypted Files</div>
                <Button onClick={fetchFiles} disabled={loading}>
                    {loading ? "Loading..." : "Get Files"}
                </Button>
            </div>

            <Separator className="my-5" />

            {/* 🔹 Display Encrypted Files in Table */}
            {files.length > 0 ? (
                <Table className="w-full max-w-3xl">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Original Filename</TableHead>
                            <TableHead>Encrypted Filename</TableHead>
                            <TableHead>Upload Time</TableHead>
                            <TableHead className="text-center">Download</TableHead>
                            <TableHead className="text-center">Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.id}</TableCell>
                                <TableCell>{file.original_filename}</TableCell>
                                <TableCell>{file.encrypted_filename}</TableCell>
                                <TableCell>{new Date(file.upload_timestamp).toLocaleString()}</TableCell>
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
            ) : (
                <p className="text-gray-500 text-center">No encrypted files found.</p>
            )}
        </div>
    );
}
