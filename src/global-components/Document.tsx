import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { DocumentText1, ExportCurve, ExportSquare, Gallery, More, Trash } from "iconsax-react";

type DocumentValue = {
    name: string;
    url: string;
    mimeType?: string;
    isLocal?: boolean;
};

type DocumentProps = {
    value: DocumentValue | null;
    onChange?: (file: DocumentValue | null) => void;
    label?: string;
    inputId?: string;
};

const Document: React.FC<DocumentProps> = ({ value, onChange, label = "Upload file...", inputId }) => {
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const isImage = value?.mimeType?.startsWith("image") || false;

    // Cleanup blob URLs when component unmounts or value changes
    useEffect(() => {
        return () => {
            if (value?.isLocal) {
                URL.revokeObjectURL(value.url);
            }
        };
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setLoading(true);
            setTimeout(() => {
                const blobUrl = URL.createObjectURL(selectedFile);
                const nextValue: DocumentValue = {
                    name: selectedFile.name,
                    url: blobUrl,
                    mimeType: selectedFile.type,
                    isLocal: true,
                };
                onChange?.(nextValue);
                setLoading(false);
            }, 1000);
        }
    };

    const handleDelete = () => {
        if (value?.isLocal) {
            URL.revokeObjectURL(value.url);
        }
        onChange?.(null);
        setIsMenuOpen(false);
    };

    const baseStyles = "w-full flex items-center rounded-[8px] px-[12px] py-[12px] min-h-[48px] min-w-[200px]";
    const uploadPromptStyles = "dashed-border-style justify-center";
    const regularStyles = "border border-solid border-szGray300 justify-between";
    const optionStyles = "flex px-[12px] py-[8px] gap-[10px] items-center text-body-small-reg cursor-pointer";

    const currentType: "uploadPrompt" | "file" | "image" = value ? (isImage ? "image" : "file") : "uploadPrompt";

    return (
        <div
            className={`${baseStyles} ${currentType === "uploadPrompt" ? uploadPromptStyles : regularStyles} ${
                currentType === "uploadPrompt" && !loading ? "cursor-pointer hover:bg-szGrey150 active:bg-szGrey150" : "cursor-default"
            } relative`}
            onClick={() => {
                if (currentType === "uploadPrompt" && !loading) {
                    fileInputRef.current?.click();
                }
            }}
        >
            <input ref={fileInputRef} id={inputId} type="file" className="hidden" onChange={handleFileUpload} />

            <div className="flex items-center gap-[8px] min-w-0">
                {currentType !== "uploadPrompt" && (
                    <div>{isImage ? <Gallery className="icon-md" /> : <DocumentText1 className="icon-md" />}</div>
                )}
                <p className="body-small-reg truncate">
                    {currentType === "uploadPrompt" ? (loading ? "Uploading..." : label) : value?.name}
                </p>
                {currentType === "uploadPrompt" && <div>{loading ? <Spinner size="medium" /> : <ExportCurve className="icon-md" />}</div>}
            </div>

            {value && (
                <div className="relative" ref={menuRef}>
                    <button
                        className="text-gray-500 hover:text-szPrimary500 active:text-szPrimary500"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen((prev) => !prev);
                        }}
                    >
                        <More className="icon-sm" variant="Outline" />
                    </button>

                    {isMenuOpen && (
                        <div className="w-fit absolute -right-3 top-full mt-4 bg-white border border-szGray200 rounded-[8px] z-10">
                            <div
                                className={`${optionStyles} hover:bg-szPrimary100 hover:rounded-t-[8px]`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                    window.open(value.url, "_blank");
                                }}
                            >
                                <ExportSquare size="12" />
                                <p>Open</p>
                            </div>
                            <div
                                className={`${optionStyles} hover:bg-szPrimary100 hover:rounded-b-[8px]`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                            >
                                <Trash size="12" />
                                <p>Delete</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Document;
