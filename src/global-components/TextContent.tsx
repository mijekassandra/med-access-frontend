import React from "react";

interface TextContentProps {
    icon?: React.ReactNode;
    header?: string;
    text?: string;
    sidetext?: string;
}

const TextContent: React.FC<TextContentProps> = ({ icon, header, text, sidetext }) => {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
                {icon}
                <div className="flex flex-col">
                    <p className="text-caption-all-caps text-szGrey500 uppercase">{header}</p>
                    <p className="text-body-small-strong -mt-1">{text}</p>
                </div>
            </div>

            <p className="text-body-small-strong text-center -mt-1">{sidetext}</p>
        </div>
    );
};

export default TextContent;
