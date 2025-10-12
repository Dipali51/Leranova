import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AssetLibraryImportModal({ onClose, onImport }) {
    const [assets, setAssets] = useState([]);
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3001/api/assets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAssets(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssets();
    }, []);

    const toggle = (id) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleImport = () => {
        onImport(Array.from(selected));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Asset Library</h3>
                    <button onClick={onClose} className="text-gray-500">✖</button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {assets.map((a) => (
                        <div key={a._id} className="border p-2 rounded">
                            <div className="text-sm font-medium truncate">{a.fileName}</div>
                            <div className="text-xs text-gray-500">{a.mimeType}</div>
                            <div className="mt-2 flex items-center justify-between">
                                <a href={a.filePath} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">View</a>
                                <input type="checkbox" checked={selected.has(a._id)} onChange={() => toggle(a._id)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded">Import selected</button>
                </div>
            </div>
        </div>
    );
}
